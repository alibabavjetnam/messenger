/**
 * Test hồi quy cho phát hiện review T6 (.az/reports/az-reviewer-T6.md) ở src/data/binance.ts:
 *  - MINOR-1: gộp nến REST không ghi đè nến đã có (WS) bằng bản REST có thể còn đang chạy.
 *  - MINOR-2: LiveFeed.start(..., resume = true) báo tải bù ngay khi kết nối xong.
 *  - NIT: lần kết nối đầu thất bại rồi mới thành công thì không báo tải bù.
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

const c = (t: number, x = 1): Candle => ({ t, o: x, h: x, l: x, c: x, v: 0 });
const M = 60_000;

describe('MINOR-1: backfill không ghi đè nến vừa đóng bằng bản REST cũ', () => {
  test('REST chụp nến 10:00 đang chạy, WS đã gửi bản đóng của 10:00 rồi nến 10:01: giữ bản WS', () => {
    const list = [c(8 * M), c(9 * M), c(10 * M, 1.5)];
    const fresh = [c(8 * M), c(9 * M), c(10 * M, 2)]; // REST gửi lúc 10:00:58, nến 10:00 close = 2
    upsertCandle(list, c(10 * M, 3)); // WS: bản cuối của nến 10:00 (đã đóng)
    upsertCandle(list, c(11 * M, 4)); // WS: nến 10:01
    mergeCandles(list, fresh);
    assert.deepEqual(list.map((x) => [x.t / M, x.c]), [[8, 1], [9, 1], [10, 3], [11, 4]]);
  });
  test('nến cuối của REST vẫn được chèn nếu chuỗi chưa có; các nến REST đã đóng vẫn ghi đè', () => {
    const list = [c(8 * M, 5)];
    mergeCandles(list, [c(8 * M, 6), c(9 * M, 7)]);
    assert.deepEqual(list.map((x) => [x.t / M, x.c]), [[8, 6], [9, 7]]);
  });
});

describe('MINOR-2 / NIT: LiveFeed báo tải bù đúng lúc', () => {
  test('start(..., true): gọi onReconnect một lần khi kết nối xong (bật lại Realtime trên dữ liệu cũ)', () => {
    let n = 0;
    const feed = new LiveFeed(() => {}, () => {}, () => { n++; });
    feed.start('BTCUSDT', ['15m', '1d'], true);
    FakeWS.all.at(-1)!.onopen!();
    assert.equal(n, 1);
    feed.start('BTCUSDT', ['15m', '1d'], true);
    FakeWS.all.at(-1)!.close(); // lần đầu thất bại vẫn phải tải bù khi thành công
    timers.shift()!();
    assert.equal(n, 1);
    FakeWS.all.at(-1)!.onopen!();
    assert.equal(n, 2);
    feed.stop();
  });
  test('NIT: start mới, lần kết nối đầu thất bại rồi thành công: không gọi onReconnect', () => {
    let n = 0;
    const feed = new LiveFeed(() => {}, () => {}, () => { n++; });
    feed.start('BTCUSDT', ['15m', '1d']);
    FakeWS.all.at(-1)!.close(); // chưa từng mở: chưa có dữ liệu realtime nào bị lỡ
    timers.shift()!();
    FakeWS.all.at(-1)!.onopen!();
    assert.equal(n, 0);
    FakeWS.all.at(-1)!.close(); // đã mở rồi mới rớt
    timers.shift()!();
    FakeWS.all.at(-1)!.close(); // thử lại thất bại
    timers.shift()!();
    FakeWS.all.at(-1)!.onopen!();
    assert.equal(n, 1);
    feed.stop();
  });
});
