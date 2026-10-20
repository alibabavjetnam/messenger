import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildSeries } from '../src/core/indicators';
import { trendAt, TREND_LABEL } from '../src/core/trend';
import { DEFAULT_SETTINGS, type Candle, type Series } from '../src/core/types';
import { DAY, genCandles, mirror, prng } from './fixtures';

const cfg = DEFAULT_SETTINGS;
const KEYS = ['structure', 'trendline', 'maOrder', 'pricePos', 'maSlope'];

/** Xu hướng tăng đều có sóng (đỉnh/đáy pivot rõ ràng). */
function zigzagUp(n = 400): Candle[] {
  return Array.from({ length: n }, (_, i) => {
    const base = 100 + i + 5 * Math.sin(i / 4);
    return { t: i * DAY, o: base, h: base + 1, l: base - 1, c: base + 0.5, v: 1 };
  });
}

/**
 * Series dựng tay: high = low = close đơn điệu (không có pivot), MA tùy ý.
 * slope = 0: giá phẳng (R² = 0, kênh giá vote 0); slope ≠ 0: đường thẳng kết thúc ở c (R² = 1).
 */
function fakeSeries(n: number, c: number, e20: number, m50: (k: number) => number, m200: (k: number) => number, slope = 0): Series {
  const flat = Array.from({ length: n }, (_, k) => c + (k - (n - 1)) * slope);
  return {
    candles: flat.map((x, k) => ({ t: k * DAY, o: x, h: x, l: x, c: x, v: 0 })),
    open: flat, high: flat, low: flat, close: flat,
    ema20: new Array(n).fill(e20),
    sma50: Array.from({ length: n }, (_, k) => m50(k)),
    sma200: Array.from({ length: n }, (_, k) => m200(k)),
    rsi: new Array(n).fill(50),
    bbUpper: flat, bbMid: flat, bbLower: flat,
  };
}

describe('trendAt: chấm điểm', () => {
  test('tăng đều: UP 6/6, mọi tiêu chí +1, đúng thứ tự và trọng số', () => {
    const r = trendAt(buildSeries(zigzagUp()), 399, cfg);
    assert.equal(r.trend, 'UP');
    assert.deepEqual([r.upScore, r.downScore, r.maxScore], [6, 0, 6]);
    assert.deepEqual(r.criteria.map((c) => c.key), KEYS);
    assert.deepEqual(r.criteria.map((c) => c.weight), [2, 1, 1, 1, 1]);
    assert.deepEqual(r.criteria.map((c) => c.vote), [1, 1, 1, 1, 1]);
    assert.equal(r.criteria[0].note, 'Đỉnh sau cao hơn, đáy sau cao hơn (HH-HL)');
    assert.equal(r.criteria[2].note, 'EMA20 > SMA50 > SMA200');
  });

  test('gương của tăng đều: DOWN 6/6, mọi tiêu chí -1', () => {
    const r = trendAt(buildSeries(mirror(zigzagUp(), 1000)), 399, cfg);
    assert.equal(r.trend, 'DOWN');
    assert.deepEqual([r.upScore, r.downScore, r.maxScore], [0, 6, 6]);
    assert.deepEqual(r.criteria.map((c) => c.vote), [-1, -1, -1, -1, -1]);
    assert.equal(r.criteria[0].note, 'Đỉnh sau thấp hơn, đáy sau thấp hơn (LH-LL)');
  });

  test('thiếu dữ liệu (60 nến): MA vote null, maxScore vẫn 6, SIDEWAYS', () => {
    const r = trendAt(buildSeries(zigzagUp(60)), 59, cfg);
    assert.equal(r.maxScore, 6);
    assert.deepEqual(r.criteria.slice(2).map((c) => c.vote), [null, null, null]);
    assert.equal(r.criteria[2].note, 'Cần ít nhất 200 nến');
    assert.equal(r.criteria[4].note, 'Cần ít nhất 210 nến');
    assert.equal(r.upScore, 3); // cấu trúc 2 + kênh giá 1
    assert.equal(r.trend, 'SIDEWAYS');
  });

  test('không đủ đỉnh/đáy pivot: structure vote null', () => {
    const r = trendAt(fakeSeries(220, 4, 3, () => 2, () => 1), 219, cfg);
    assert.equal(r.criteria[0].vote, null);
    assert.equal(r.criteria[0].note, 'Chưa đủ đỉnh/đáy để so sánh');
    assert.equal(r.criteria[1].vote, 0); // giá phẳng, R² = 0
  });

  test('ngưỡng trendMinScore: 3 điểm tăng là SIDEWAYS với min 4, UP với min 3', () => {
    // EMA20 3 > SMA50 2 > SMA200 1, giá 4 trên cả 3, SMA50/SMA200 dốc lên
    const s = fakeSeries(220, 4, 3, (k) => 2 + k * 1e-3, (k) => 1 + k * 1e-3);
    const r4 = trendAt(s, 219, cfg);
    assert.deepEqual([r4.upScore, r4.downScore, r4.trend], [3, 0, 'SIDEWAYS']);
    const r3 = trendAt(s, 219, { ...cfg, trendMinScore: 3 });
    assert.equal(r3.trend, 'UP');
  });

  test('ngưỡng chênh lệch ≥ 3: 2 tăng / 1 giảm là SIDEWAYS dù min thấp', () => {
    // MA xếp tăng (+1), dốc lên (+1), giá 0.5 dưới cả 3 (-1)
    const s = fakeSeries(220, 0.5, 3, (k) => 2 + k * 1e-3, (k) => 1 + k * 1e-3);
    const r = trendAt(s, 219, { ...cfg, trendMinScore: 1 });
    assert.deepEqual([r.upScore, r.downScore, r.trend], [2, 1, 'SIDEWAYS']);
    assert.equal(r.criteria[3].note, 'Giá nằm dưới cả 3 đường MA');
  });

  test('chênh lệch đúng 2 (3 tăng / 1 giảm) vẫn là SIDEWAYS với min 3', () => {
    // giá giảm thẳng (kênh giá -1) nhưng giá cuối 4 nằm trên MA xếp tăng, dốc lên
    const s = fakeSeries(220, 4, 3, (k) => 2 + k * 1e-3, (k) => 1 + k * 1e-3, -0.001);
    const r = trendAt(s, 219, { ...cfg, trendMinScore: 3 });
    assert.equal(r.criteria[0].vote, null);
    assert.deepEqual(r.criteria.slice(1).map((c) => c.vote), [-1, 1, 1, 1]);
    assert.deepEqual([r.upScore, r.downScore, r.trend], [3, 1, 'SIDEWAYS']);
  });

  test('phe giảm: 3 điểm giảm với min 3 là DOWN', () => {
    const s = fakeSeries(220, 0.5, 1, (k) => 2 - k * 1e-3, (k) => 3 - k * 1e-3);
    const r = trendAt(s, 219, { ...cfg, trendMinScore: 3 });
    assert.deepEqual([r.upScore, r.downScore, r.trend], [0, 3, 'DOWN']);
  });

  test('MA đan xen và độ dốc trái chiều cho vote 0', () => {
    const s = fakeSeries(220, 2.5, 3, (k) => 1 + k * 1e-3, (k) => 2 - k * 1e-3);
    const r = trendAt(s, 219, cfg);
    assert.deepEqual(r.criteria.slice(2).map((c) => c.vote), [0, 0, 0]);
    assert.equal(r.criteria[4].note, 'Không cùng hướng');
  });

  test('TREND_LABEL', () => {
    assert.deepEqual(TREND_LABEL, { UP: 'Xu hướng tăng', DOWN: 'Xu hướng giảm', SIDEWAYS: 'Không có xu hướng' });
  });
});

describe('trendAt: đối xứng và không nhìn trước', () => {
  const candles = genCandles(prng(21), 420, Date.UTC(2023, 0, 1), DAY, 100, 0.002);
  const s = buildSeries(candles);
  const m = buildSeries(mirror(candles, 1000));
  const flip = { UP: 'DOWN', DOWN: 'UP', SIDEWAYS: 'SIDEWAYS' } as const;

  test('dữ liệu lật (K - giá) cho kết quả đối xứng tại mọi nến', () => {
    let trending = 0;
    for (let i = 0; i < candles.length; i++) {
      const a = trendAt(s, i, cfg);
      const b = trendAt(m, i, cfg);
      assert.equal(b.trend, flip[a.trend], `i=${i}`);
      assert.deepEqual([b.upScore, b.downScore], [a.downScore, a.upScore], `i=${i}`);
      assert.deepEqual(b.criteria.map((c) => c.vote), a.criteria.map((c) => (c.vote === null ? null : (c.vote === 0 ? 0 : -c.vote))), `i=${i}`);
      if (a.trend !== 'SIDEWAYS') trending++;
    }
    assert.ok(trending > 50, `chỉ có ${trending} nến có xu hướng`);
  });

  test('chỉ dùng dữ liệu <= i: tính trên tiền tố cho cùng kết quả', () => {
    for (const i of [30, 150, 209, 250, 333, 400]) {
      const pre = buildSeries(candles.slice(0, i + 1));
      assert.deepEqual(trendAt(pre, i, cfg), trendAt(s, i, cfg), `i=${i}`);
    }
  });
});
