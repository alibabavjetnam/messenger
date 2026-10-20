/**
 * Test hồi quy cho phát hiện review T8 (.az/reports/az-reviewer-T8.md), MINOR-A ở src/data/binance.ts:
 * nến trùng t ở cuối lô REST: giữ bản có khối lượng lớn hơn (khối lượng trong một nến không giảm), bằng nhau giữ bản đang có.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import type { Candle } from '../src/core/types';
import { mergeCandles } from '../src/data/binance';

const M = 60_000;
const c = (t: number, x: number, v: number): Candle => ({ t, o: x, h: x, l: x, c: x, v });
const tail = (list: Candle[]) => [list.at(-1)!.c, list.at(-1)!.v];

describe('MINOR-A: nến cuối của lô REST trùng t với nến đang có', () => {
  test('REST mới hơn (v lớn hơn, ví dụ bật lại Realtime trong cùng một nến): lấy bản REST', () => {
    const list = [c(8 * M, 1, 5), c(9 * M, 1, 5), c(10 * M, 1.5, 10)];
    mergeCandles(list, [c(8 * M, 1, 5), c(9 * M, 1, 5), c(10 * M, 2.9, 80)]);
    assert.deepEqual(tail(list), [2.9, 80]);
    assert.equal(list.length, 3);
  });
  test('bản đang có mới hơn (WS đã cập nhật/đóng nến sau khi REST chụp): giữ bản đang có', () => {
    const list = [c(9 * M, 1, 5), c(10 * M, 3, 90)];
    mergeCandles(list, [c(9 * M, 1, 5), c(10 * M, 2, 40)]);
    assert.deepEqual(tail(list), [3, 90]);
  });
  test('khối lượng bằng nhau: giữ bản đang có', () => {
    const list = [c(9 * M, 1, 5), c(10 * M, 3, 40)];
    mergeCandles(list, [c(9 * M, 1, 5), c(10 * M, 2, 40)]);
    assert.deepEqual(tail(list), [3, 40]);
  });
  test('các nến REST khác (đã đóng) vẫn ghi đè bất kể khối lượng', () => {
    const list = [c(9 * M, 1, 99), c(10 * M, 3, 40)];
    mergeCandles(list, [c(9 * M, 7, 5), c(10 * M, 2, 40)]);
    assert.deepEqual(list.map((x) => [x.c, x.v]), [[7, 5], [3, 40]]);
  });
});
