import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  bollinger, buildSeries, ema, isPivotHigh, isPivotLow, linearRegression, regressionChannel, rsi, sma,
} from '../src/core/indicators';
import { genCandles, prng, DAY } from './fixtures';

const close = (a: number | null, b: number, eps = 1e-9) => {
  assert.notEqual(a, null);
  assert.ok(Math.abs((a as number) - b) <= eps, `${a} != ${b}`);
};

describe('sma', () => {
  test('giá trị đầu tiên ở chỉ số period-1, trước đó là null', () => {
    assert.deepEqual(sma([1, 2, 3, 4, 5], 3), [null, null, 2, 3, 4]);
  });
  test('cửa sổ trượt đúng với dãy không đều', () => {
    assert.deepEqual(sma([10, 20, 60, 0, 20], 2), [null, 15, 40, 30, 10]);
  });
  test('ít dữ liệu hơn period thì toàn null', () => {
    assert.deepEqual(sma([1, 2], 3), [null, null]);
  });
  test('mảng rỗng', () => {
    assert.deepEqual(sma([], 5), []);
  });
});

describe('ema', () => {
  test('seed bằng SMA của period giá trị đầu, k = 2/(period+1)', () => {
    // period 3, k = 0.5: seed (2+4+6)/3 = 4; (8-4)*.5+4 = 6; (4-6)*.5+6 = 5
    assert.deepEqual(ema([2, 4, 6, 8, 4], 3), [null, null, 4, 6, 5]);
  });
  test('period 4, k = 0.4', () => {
    const e = ema([1, 2, 3, 4, 9], 4);
    assert.deepEqual(e.slice(0, 3), [null, null, null]);
    close(e[3], 2.5);
    close(e[4], 2.5 + (9 - 2.5) * 0.4);
  });
  test('ít dữ liệu hơn period thì toàn null', () => {
    assert.deepEqual(ema([1, 2], 3), [null, null]);
  });
});

describe('rsi (Wilder)', () => {
  test('giá trị đầu ở chỉ số period, làm mượt (period-1)/period', () => {
    // d = +1, -1, +1, +1; period 2: avg 0.5/0.5 -> 50; rồi 0.75/0.25 -> 75; 0.875/0.125 -> 87.5
    assert.deepEqual(rsi([1, 2, 1, 2, 3], 2), [null, null, 50, 75, 87.5]);
  });
  test('toàn tăng = 100, toàn giảm = 0', () => {
    const up = Array.from({ length: 20 }, (_, i) => i);
    const down = up.map((x) => 100 - x);
    assert.equal(rsi(up, 14)[14], 100);
    assert.equal(rsi(up, 14)[19], 100);
    assert.equal(rsi(down, 14)[14], 0);
    assert.equal(rsi(down, 14)[13], null);
  });
  test('giá đi ngang (avgLoss = 0) cho 100 (hành vi hiện tại)', () => {
    assert.equal(rsi(new Array(16).fill(5), 14)[15], 100);
  });
  test('length <= period thì toàn null', () => {
    assert.deepEqual(rsi([1, 2, 3], 3), [null, null, null]);
  });
  test('period mặc định 14, giá trị luôn trong [0, 100]', () => {
    const c = genCandles(prng(1), 300, 0, DAY, 100, 0).map((x) => x.c);
    const r = rsi(c);
    assert.equal(r[13], null);
    assert.notEqual(r[14], null);
    for (const x of r.slice(14)) assert.ok((x as number) >= 0 && (x as number) <= 100);
  });
});

describe('bollinger', () => {
  test('độ lệch chuẩn tổng thể (chia cho period)', () => {
    // mean 5, sd 2 (ví dụ kinh điển)
    const b = bollinger([2, 4, 4, 4, 5, 5, 7, 9], 8, 2);
    assert.equal(b.mid[7], 5);
    assert.equal(b.upper[7], 9);
    assert.equal(b.lower[7], 1);
    assert.equal(b.mid[6], null);
  });
  test('mult tùy chỉnh và giá trị trung bình trượt', () => {
    const b = bollinger([1, 2, 3, 4, 5], 5, 1);
    close(b.mid[4], 3);
    close(b.upper[4], 3 + Math.SQRT2);
    close(b.lower[4], 3 - Math.SQRT2);
  });
  test('mặc định period 20 mult 2; giá phẳng thì 3 dải trùng nhau', () => {
    const b = bollinger(new Array(25).fill(7));
    assert.equal(b.mid[18], null);
    assert.deepEqual([b.lower[19], b.mid[19], b.upper[19]], [7, 7, 7]);
  });
});

describe('linearRegression', () => {
  test('đường thẳng hoàn hảo: slope, intercept, r2 = 1, slopePct', () => {
    const y = Array.from({ length: 12 }, (_, k) => 3 + 2 * k);
    const lr = linearRegression(y, 11, 12)!;
    close(lr.slope, 2);
    close(lr.intercept, 3);
    close(lr.r2, 1);
    assert.equal(lr.start, 0);
    assert.equal(lr.n, 12);
    close(lr.slopePct, (2 / 14) * 100); // meanY = 3 + 2*5.5 = 14
  });
  test('cửa sổ [end-len+1, end] và intercept tính tại đầu cửa sổ', () => {
    const y = Array.from({ length: 40 }, (_, k) => 100 - k);
    const lr = linearRegression(y, 30, 15)!;
    assert.equal(lr.start, 16);
    assert.equal(lr.n, 15);
    close(lr.slope, -1);
    close(lr.intercept, 84);
    close(lr.r2, 1);
  });
  test('giá phẳng: slope 0, r2 = 0', () => {
    const lr = linearRegression(new Array(20).fill(5), 19, 20)!;
    assert.equal(lr.slope, 0);
    assert.equal(lr.r2, 0);
    assert.equal(lr.slopePct, 0);
  });
  test('dữ liệu nhiễu: slope = 10/11, r2 = 25/33 (tính tay)', () => {
    // sx=45 sy=40 sxy=255 sxx=285 syy=250, n=10
    const lr = linearRegression([1, -1, 3, 1, 5, 3, 7, 5, 9, 7], 9, 10)!;
    close(lr.slope, 10 / 11);
    close(lr.intercept, (40 - (10 / 11) * 45) / 10);
    close(lr.r2, 25 / 33);
  });
  test('ít hơn 10 điểm thì null', () => {
    const y = Array.from({ length: 30 }, (_, k) => k);
    assert.equal(linearRegression(y, 8, 50), null); // chỉ có 9 điểm
    assert.equal(linearRegression(y, 20, 9), null);
    assert.notEqual(linearRegression(y, 9, 50), null);
  });
});

describe('regressionChannel', () => {
  test('chỉ vẽ len nến cuối; đường thẳng hoàn hảo thì upper = mid = lower', () => {
    const y = Array.from({ length: 30 }, (_, k) => 10 + k);
    const ch = regressionChannel(y, 20);
    assert.equal(ch.mid[9], null);
    close(ch.mid[10], 20);
    close(ch.mid[29], 39);
    close(ch.upper[29], 39);
    close(ch.lower[29], 39);
  });
  test('dải ±2σ phần dư', () => {
    const y = [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2];
    const ch = regressionChannel(y, 12);
    for (let k = 0; k < 12; k++) {
      close((ch.upper[k] as number) - (ch.mid[k] as number), (ch.mid[k] as number) - (ch.lower[k] as number));
    }
    assert.ok((ch.upper[0] as number) - (ch.mid[0] as number) > 1.5);
  });
  test('thiếu dữ liệu: toàn null', () => {
    const ch = regressionChannel([1, 2, 3], 120);
    assert.deepEqual(ch.mid, [null, null, null]);
    assert.deepEqual(ch.upper, [null, null, null]);
  });
});

describe('isPivotLow / isPivotHigh (tham số nguyên)', () => {
  const low = [5, 4, 3, 1, 3, 4, 5];
  test('đáy nghiêm ngặt hai phía', () => {
    assert.equal(isPivotLow(low, 3, 3, 3, 6), true);
    assert.equal(isPivotLow(low, 2, 2, 2, 6), false);
  });
  test('bằng nhau với nến bên cạnh thì không phải pivot (cả trái lẫn phải)', () => {
    assert.equal(isPivotLow([5, 1, 1, 5, 6], 1, 1, 1, 4), false);
    assert.equal(isPivotLow([5, 1, 1, 5, 6], 2, 1, 1, 4), false);
    assert.equal(isPivotHigh([1, 5, 5, 1, 0], 1, 1, 1, 4), false);
  });
  test('tôn trọng end: không nhìn nến > end', () => {
    assert.equal(isPivotLow(low, 3, 3, 3, 5), false); // cần tới chỉ số 6
    assert.equal(isPivotLow(low, 3, 3, 2, 5), true);
  });
  test('thiếu nến bên trái thì false', () => {
    assert.equal(isPivotLow(low, 3, 4, 1, 6), false);
  });
  test('left/right khác nhau', () => {
    const l = [9, 8, 7, 6, 2, 3, 1];
    assert.equal(isPivotLow(l, 4, 4, 1, 6), true);
    assert.equal(isPivotLow(l, 4, 4, 2, 6), false); // l[6]=1 thấp hơn
  });
  test('đỉnh pivot đối xứng với đáy pivot', () => {
    const high = low.map((x) => -x);
    for (let k = 0; k < high.length; k++) {
      assert.equal(isPivotHigh(high, k, 2, 2, 6), isPivotLow(low, k, 2, 2, 6), `k=${k}`);
    }
    assert.equal(isPivotHigh(high, 3, 3, 3, 6), true);
  });
});

describe('buildSeries', () => {
  test('các mảng cùng độ dài, khớp với chỉ báo tính riêng', () => {
    const candles = genCandles(prng(3), 260, Date.UTC(2024, 0, 1), DAY, 100, 0.001);
    const s = buildSeries(candles);
    const c = candles.map((x) => x.c);
    assert.equal(s.candles, candles);
    for (const k of ['open', 'high', 'low', 'close', 'ema20', 'sma50', 'sma200', 'rsi', 'bbUpper', 'bbMid', 'bbLower'] as const) {
      assert.equal(s[k].length, 260, k);
    }
    assert.deepEqual(s.open, candles.map((x) => x.o));
    assert.deepEqual(s.high, candles.map((x) => x.h));
    assert.deepEqual(s.low, candles.map((x) => x.l));
    assert.deepEqual(s.close, c);
    assert.deepEqual(s.ema20, ema(c, 20));
    assert.deepEqual(s.sma50, sma(c, 50));
    assert.deepEqual(s.sma200, sma(c, 200));
    assert.deepEqual(s.rsi, rsi(c, 14));
    const bb = bollinger(c, 20, 2);
    assert.deepEqual([s.bbUpper, s.bbMid, s.bbLower], [bb.upper, bb.mid, bb.lower]);
    assert.equal(s.sma200[198], null);
    assert.notEqual(s.sma200[199], null);
  });
  test('chỉ báo nhân quả: tính trên tiền tố cho cùng giá trị', () => {
    const candles = genCandles(prng(4), 300, 0, DAY, 50, 0);
    const full = buildSeries(candles);
    const pre = buildSeries(candles.slice(0, 220));
    for (const k of ['ema20', 'sma50', 'sma200', 'rsi', 'bbUpper', 'bbLower'] as const) {
      assert.deepEqual(full[k].slice(0, 220), pre[k], k);
    }
  });
});
