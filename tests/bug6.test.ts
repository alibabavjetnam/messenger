/** Test hồi quy BUG-6 (.az/bugs/BUG-6.md): CSV ngày-giờ không có offset hiểu là UTC. */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { parseRawCandles } from '../src/data/binance';

describe('BUG-6: CSV ngày-giờ không có offset được hiểu là UTC', () => {
  test('cùng kết quả ở UTC+7 và UTC-5', () => {
    const csv = ['2024-01-01,1,2,0.5,1.5,10', '2024-01-01 00:00,1,2,0.5,1.5,10', '2024-01-01T00:00:00,1,2,0.5,1.5,10',
      '2024-01-01 07:30,1,2,0.5,1.5,10', '2024-01-01T08:00:00Z,1,2,0.5,1.5,10', '2024-01-01T10:00:00+07:00,1,2,0.5,1.5,10'].join('\n');
    const old = process.env.TZ;
    try {
      for (const tz of ['Asia/Ho_Chi_Minh', 'America/New_York']) {
        process.env.TZ = tz;
        const out = parseRawCandles(csv).map((x) => new Date(x.t).toISOString());
        assert.deepEqual(out, ['2024-01-01T00:00:00.000Z', '2024-01-01T03:00:00.000Z', '2024-01-01T07:30:00.000Z', '2024-01-01T08:00:00.000Z'], tz);
      }
    } finally {
      if (old === undefined) delete process.env.TZ; else process.env.TZ = old;
    }
  });
});
