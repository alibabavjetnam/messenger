/** Test hồi quy BUG-2 (.az/bugs/BUG-2.md): xu hướng D1 realtime chỉ dùng nến ngày đã đóng. */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildSeries } from '../src/core/indicators';
import { trendAt } from '../src/core/trend';
import { DEFAULT_SETTINGS, type Candle } from '../src/core/types';
import { lastClosedIndex } from '../src/data/binance';
import { DAY, HOUR } from './fixtures';

describe('BUG-2: xu hướng D1 realtime chỉ dùng nến ngày đã đóng', () => {
  const d0 = Date.UTC(2024, 0, 1);
  const days: Candle[] = [0, 1, 2].map((k) => ({ t: d0 + k * DAY, o: 1, h: 1, l: 1, c: 1, v: 0 }));
  test('nến ngày đang chạy bị loại', () => {
    assert.equal(lastClosedIndex(days, DAY, d0 + 2 * DAY + HOUR), 1); // 01:00 ngày thứ 3: ngày 3 chưa đóng
    assert.equal(lastClosedIndex(days, DAY, d0 + 3 * DAY), 2); // đúng 00:00 hôm sau: đã đóng (giống backtest, <=)
    assert.equal(lastClosedIndex(days, DAY, d0 + 3 * DAY - 1), 1);
    assert.equal(lastClosedIndex(days, DAY, d0), -1);
    assert.equal(lastClosedIndex([], DAY, d0), -1);
  });
  test('trendAt với chỉ số -1 (chưa có ngày nào đóng) không ném lỗi và trả SIDEWAYS', () => {
    const s = buildSeries(days);
    assert.equal(trendAt(s, lastClosedIndex(days, DAY, d0), DEFAULT_SETTINGS).trend, 'SIDEWAYS');
  });
});
