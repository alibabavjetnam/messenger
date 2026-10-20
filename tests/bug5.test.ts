/**
 * Test hồi quy BUG-5 (.az/bugs/BUG-5.md): sau khi WebSocket kết nối lại phải tải bù nến bị lỡ.
 * LiveFeed báo "đã kết nối lại"; mergeCandles gộp nến REST vào chuỗi đang có.
 * WebSocket và window.setTimeout được giả lập (không gọi mạng).
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import type { Candle } from '../src/core/types';

class FakeWS {
  static all: FakeWS[] = [];
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onmessage: ((e: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(public url: string) { FakeWS.all.push(this); }
  close() { this.onclose?.(); }
}
const timers: (() => void)[] = [];
const g = globalThis as Record<string, unknown>;
g.WebSocket = FakeWS;
g.window = { setTimeout: (fn: () => void) => { timers.push(fn); return timers.length; }, clearTimeout: () => {} };

const { LiveFeed, mergeCandles, upsertCandle } = await import('../src/data/binance');

describe('BUG-5: LiveFeed báo kết nối lại', () => {
  test('lần mở đầu tiên không gọi onReconnect; mở lại sau khi rớt thì gọi đúng 1 lần', () => {
    let reconnects = 0;
    const statuses: string[] = [];
    const feed = new LiveFeed(() => {}, (s) => statuses.push(s), () => { reconnects++; });
    feed.start('BTCUSDT', ['15m', '1d']);
    FakeWS.all.at(-1)!.onopen!();
    assert.equal(reconnects, 0);
    FakeWS.all.at(-1)!.close(); // rớt mạng
    assert.equal(timers.length, 1);
    timers.shift()!(); // hết thời gian chờ, kết nối lại
    FakeWS.all.at(-1)!.onopen!();
    assert.equal(reconnects, 1);
    assert.equal(statuses.at(-1), 'live');
    feed.stop();
    feed.start('BTCUSDT', ['15m', '1d']); // bật lại sau khi dừng: là kết nối mới, không phải kết nối lại
    FakeWS.all.at(-1)!.onopen!();
    assert.equal(reconnects, 1);
    feed.stop();
  });
});

describe('BUG-5: gộp nến REST sau khi WebSocket kết nối lại', () => {
  const c = (t: number, x = 1): Candle => ({ t, o: x, h: x, l: x, c: x, v: 0 });
  test('khoảng trống được lấp, nến cũ được cập nhật giá cuối, giữ thứ tự và giới hạn', () => {
    const M = 60_000;
    const list = [c(0), c(M), c(2 * M, 5)]; // nến 2M dừng ở giá 5 lúc rớt mạng
    upsertCandle(list, c(6 * M, 9)); // nến đầu tiên sau khi nối lại: tạo khoảng trống 3M..5M
    const ref = list;
    mergeCandles(list, [c(2 * M, 7), c(3 * M), c(4 * M), c(5 * M), c(6 * M, 9)], 6);
    assert.equal(list, ref, 'sửa tại chỗ (state.tf giữ nguyên tham chiếu)');
    assert.deepEqual(list.map((x) => x.t / M), [1, 2, 3, 4, 5, 6]);
    assert.equal(list[1].c, 7); // OHLC cuối cùng của nến bị lỡ
    for (let k = 1; k < list.length; k++) assert.equal(list[k].t - list[k - 1].t, M);
  });
});
