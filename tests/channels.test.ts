import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildSeries, isPivotLow } from '../src/core/indicators';
import { evalCounterTrend, evalWithTrend, evaluateChannels } from '../src/core/channels';
import { DEFAULT_SETTINGS, type ChannelResult, type Trend, type TrendResult } from '../src/core/types';
import { HOUR, genCandles, mirror, prng } from './fixtures';

const cfg = DEFAULT_SETTINGS;
const tr = (trend: Trend): TrendResult => ({
  trend, upScore: trend === 'UP' ? 6 : 0, downScore: trend === 'DOWN' ? 6 : 0, maxScore: 6, criteria: [],
});
const flip = { UP: 'DOWN', DOWN: 'UP', SIDEWAYS: 'SIDEWAYS' } as const;

const K = 10_000;
const candles = genCandles(prng(5), 900, Date.UTC(2024, 0, 1), HOUR, 100, 0);
const s = buildSeries(candles);
const m = buildSeries(mirror(candles, K));
const states = (r: ChannelResult) => [...r.conditions.map((c) => c.state), r.entry.state];

describe('kênh: D1 không có xu hướng', () => {
  test('cả 2 kênh direction null, điều kiện 1 fail, phần còn lại wait, passed 0', () => {
    const r = evaluateChannels({ d1: tr('SIDEWAYS'), tf: tr('UP'), series: s, i: 500, cfg });
    for (const ch of [r.with, r.counter]) {
      assert.equal(ch.direction, null);
      assert.deepEqual(states(ch), ['fail', 'wait', 'wait', 'wait', 'wait']);
      assert.equal(ch.passed, 0);
      assert.equal(ch.ready, false);
      assert.equal(ch.anchorIdx, null);
      assert.equal(ch.stopLoss, null);
    }
    assert.equal(r.with.id, 'with');
    assert.equal(r.counter.id, 'counter');
  });
});

describe('kênh: điều kiện 2 theo xu hướng khung giao dịch', () => {
  const at = (d1: Trend, tf: Trend) => ({ d1: tr(d1), tf: tr(tf), series: s, i: 500, cfg });
  test('kênh 1 cần khung giao dịch cùng chiều D1', () => {
    assert.equal(evalWithTrend(at('UP', 'UP')).conditions[1].state, 'pass');
    assert.equal(evalWithTrend(at('UP', 'SIDEWAYS')).conditions[1].state, 'fail');
    assert.equal(evalWithTrend(at('UP', 'DOWN')).conditions[1].state, 'fail');
    assert.equal(evalWithTrend(at('DOWN', 'DOWN')).conditions[1].state, 'pass');
    assert.equal(evalWithTrend(at('UP', 'UP')).direction, 'BUY');
    assert.equal(evalWithTrend(at('DOWN', 'DOWN')).direction, 'SELL');
  });
  test('kênh 2 cần khung giao dịch đi ngang hoặc ngược D1', () => {
    assert.equal(evalCounterTrend(at('UP', 'SIDEWAYS')).conditions[1].state, 'pass');
    assert.equal(evalCounterTrend(at('UP', 'DOWN')).conditions[1].state, 'pass');
    assert.equal(evalCounterTrend(at('UP', 'UP')).conditions[1].state, 'fail');
    assert.equal(evalCounterTrend(at('DOWN', 'UP')).direction, 'SELL');
  });
});

describe('kênh: bất biến khi đủ điều kiện (dữ liệu tổng hợp)', () => {
  const withReady: { i: number; r: ChannelResult }[] = [];
  const counterReady: { i: number; r: ChannelResult }[] = [];
  for (let i = 210; i < candles.length; i++) {
    const a = evalWithTrend({ d1: tr('UP'), tf: tr('UP'), series: s, i, cfg });
    const b = evalCounterTrend({ d1: tr('UP'), tf: tr('SIDEWAYS'), series: s, i, cfg });
    for (const r of [a, b]) {
      const pass = states(r).filter((x) => x === 'pass').length;
      assert.equal(r.passed, pass, `passed i=${i}`);
      assert.equal(r.ready, pass === 5, `ready i=${i}`);
      assert.equal(r.conditions.length, 4);
    }
    if (a.ready) withReady.push({ i, r: a });
    if (b.ready) counterReady.push({ i, r: b });
  }

  test('có đủ mẫu tín hiệu để kiểm', () => {
    assert.ok(withReady.length >= 5, `with ready = ${withReady.length}`);
    assert.ok(counterReady.length >= 5, `counter ready = ${counterReady.length}`);
  });

  test('kênh 1 BUY: SL = râu thấp nhất nến N, trigger = đỉnh N-1, close > trigger', () => {
    for (const { i, r } of withReady) {
      const N = r.anchorIdx as number;
      assert.ok(N >= 1 && N < i, `i=${i}`);
      assert.equal(r.stopLoss, s.low[N]);
      assert.equal(r.triggerLevel, s.high[N - 1]);
      assert.ok(s.close[i] > s.high[N - 1]);
      assert.deepEqual(r.marks.map((x) => [x.idx, x.label, x.side]), [[N, 'N', 'below']]);
      assert.ok(s.close[i] > (r.stopLoss as number));
    }
  });

  test('kênh 2 BUY: đáy 2 cao hơn đáy 1, cách ≥ minGap, là pivot, đáy 1 chưa bị phá', () => {
    for (const { i, r } of counterReady) {
      assert.deepEqual(r.marks.map((x) => x.label), ['Đáy 1', 'Đáy 2']);
      const [p1, p2] = r.marks.map((x) => x.idx);
      assert.equal(r.anchorIdx, p2);
      assert.ok(p2 - p1 >= cfg.minGap, `i=${i}`);
      assert.ok(s.low[p2] > s.low[p1]);
      assert.ok(isPivotLow(s.low, p2, cfg.pivotLeft, cfg.pivotRight, i));
      for (let j = p1 + 1; j <= i; j++) assert.ok(s.low[j] > s.low[p1], `i=${i} j=${j}`);
      assert.equal(r.stopLoss, s.low[p2]);
      assert.equal(r.triggerLevel, s.high[p2 - 1]);
      assert.ok(s.close[i] > s.high[p2 - 1]);
    }
  });
});

describe('kênh: đối xứng mua/bán', () => {
  test('dữ liệu lật (K - giá) + D1 ngược chiều cho cùng trạng thái, cùng nến N/M, SL/trigger lật', () => {
    let readyCount = 0;
    const tfCases: Trend[] = ['UP', 'SIDEWAYS', 'DOWN'];
    for (let i = 210; i < candles.length; i += 3) {
      for (const tfT of tfCases) {
        const a = evaluateChannels({ d1: tr('UP'), tf: tr(tfT), series: s, i, cfg });
        const b = evaluateChannels({ d1: tr('DOWN'), tf: tr(flip[tfT]), series: m, i, cfg });
        for (const [x, y] of [[a.with, b.with], [a.counter, b.counter]]) {
          assert.equal(x.direction, 'BUY');
          assert.equal(y.direction, 'SELL');
          assert.deepEqual(states(y), states(x), `${x.id} i=${i} tf=${tfT}`);
          assert.equal(y.anchorIdx, x.anchorIdx);
          assert.deepEqual(y.marks.map((k) => k.idx), x.marks.map((k) => k.idx));
          assert.deepEqual(y.marks.map((k) => k.side), x.marks.map(() => 'above'));
          if (x.stopLoss !== null) assert.equal(y.stopLoss, K - x.stopLoss);
          if (x.triggerLevel !== null) assert.equal(y.triggerLevel, K - x.triggerLevel);
          if (x.ready) readyCount++;
        }
      }
    }
    assert.ok(readyCount > 5, `ready = ${readyCount}`);
  });

  test('nhãn SELL dùng M / Đỉnh', () => {
    for (let i = 210; i < candles.length; i++) {
      const b = evalCounterTrend({ d1: tr('DOWN'), tf: tr('SIDEWAYS'), series: m, i, cfg });
      if (b.ready) {
        assert.deepEqual(b.marks.map((x) => x.label), ['Đỉnh 1', 'Đỉnh 2']);
        return;
      }
    }
    assert.fail('không có tín hiệu SELL kênh 2');
  });
});

describe('kênh: không nhìn trước', () => {
  test('đánh giá tại i trên tiền tố [0..i] giống trên toàn bộ dữ liệu', () => {
    for (const i of [250, 400, 555, 700, 899]) {
      const pre = buildSeries(candles.slice(0, i + 1));
      for (const tfT of ['UP', 'SIDEWAYS'] as Trend[]) {
        const input = { d1: tr('UP'), tf: tr(tfT), i, cfg };
        assert.deepEqual(evaluateChannels({ ...input, series: pre }), evaluateChannels({ ...input, series: s }), `i=${i}`);
      }
    }
  });
});
