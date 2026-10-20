/** Test hồi quy BUG-1 (.az/bugs/BUG-1.md): chuẩn hóa tham số từ form và localStorage. */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildSeries, isPivotLow } from '../src/core/indicators';
import { evaluateChannels } from '../src/core/channels';
import { SETTING_FIELDS, clampSetting, sanitizeSettings } from '../src/core/settings';
import { DEFAULT_SETTINGS, type Trend, type TrendResult } from '../src/core/types';
import { HOUR, genCandles, prng } from './fixtures';

const field = (k: string) => SETTING_FIELDS.find((f) => f.key === k)!;
const tr = (trend: Trend): TrendResult => ({
  trend, upScore: trend === 'UP' ? 6 : 0, downScore: trend === 'DOWN' ? 6 : 0, maxScore: 6, criteria: [],
});

describe('BUG-1: tham số nguyên được chuẩn hóa (form + localStorage)', () => {
  test('form: số lẻ ở tham số nguyên được làm tròn, rồi kẹp [min, max]', () => {
    assert.equal(clampSetting(field('pivotLeft'), 2.5), 3);
    assert.equal(clampSetting(field('pivotRight'), 2.4), 2);
    assert.equal(clampSetting(field('minGap'), 0.4), 2); // làm tròn 0 rồi kẹp lên min 2
    assert.equal(clampSetting(field('lookbackWith'), 1e9), 300);
    assert.equal(clampSetting(field('rr'), 1.55), 1.55); // rr không phải tham số nguyên
    assert.equal(clampSetting(field('rr'), NaN), null);
  });

  test('localStorage: sai kiểu dùng mặc định, số lẻ làm tròn, ngoài khoảng bị kẹp, khóa lạ bị bỏ', () => {
    const s = sanitizeSettings({ minGap: '9', pivotLeft: 2.5, pivotRight: -4, rsiHigh: 200, rr: null, foo: 1 });
    assert.deepEqual(s, { ...DEFAULT_SETTINGS, pivotLeft: 3, pivotRight: 1, rsiHigh: 95 });
    assert.equal(typeof s.minGap, 'number');
    assert.deepEqual(sanitizeSettings(null), DEFAULT_SETTINGS);
    assert.deepEqual(sanitizeSettings('rác'), DEFAULT_SETTINGS);
    assert.deepEqual(sanitizeSettings([1, 2]), DEFAULT_SETTINGS);
  });

  test('mọi tham số nguyên sau chuẩn hóa đều là số nguyên trong khoảng', () => {
    const s = sanitizeSettings(Object.fromEntries(SETTING_FIELDS.map((f) => [f.key, f.min + 0.37])));
    for (const f of SETTING_FIELDS) {
      const v = s[f.key];
      assert.ok(v >= f.min && v <= f.max, f.key);
      if (f.step === 1) assert.ok(Number.isInteger(v), f.key);
    }
  });

  test('kênh không còn ném lỗi / pivot sai với giá trị nhập 2.5 sau khi chuẩn hóa', () => {
    const cfg = sanitizeSettings({ pivotLeft: 2.5, pivotRight: 2.5 });
    const low = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    assert.equal(isPivotLow(low, 7, cfg.pivotLeft, cfg.pivotRight, 10), false); // dãy tăng dần: không có đáy
    const s = buildSeries(genCandles(prng(5), 900, Date.UTC(2024, 0, 1), HOUR, 100, 0));
    let ready = 0;
    for (let i = 250; i < 900; i++) {
      for (const d of ['UP', 'DOWN'] as const) {
        const r = evaluateChannels({ d1: tr(d), tf: tr('SIDEWAYS'), series: s, i, cfg });
        if (r.counter.ready) ready++;
        for (const ch of [r.with, r.counter]) if (ch.stopLoss !== null) assert.ok(Number.isFinite(ch.stopLoss));
      }
    }
    assert.ok(ready > 0, 'Kênh 2 phải còn tín hiệu');
  });
});
