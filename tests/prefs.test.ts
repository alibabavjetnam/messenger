/** Test sanitizePrefs (review T6): giá trị đọc từ localStorage sai kiểu thì dùng mặc định. */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_PREFS, sanitizePrefs } from '../src/core/settings';

const TF = ['1m', '15m', '1h'];

describe('sanitizePrefs: kiểm kiểu giá trị đã lưu', () => {
  test('thiếu hết (null/undefined) thì dùng mặc định', () => {
    assert.deepEqual(sanitizePrefs({}, TF), DEFAULT_PREFS);
    assert.deepEqual(sanitizePrefs({ symbol: null, interval: null, chartType: null, live: null, watchlist: null, theme: null }, TF), DEFAULT_PREFS);
  });
  test('giá trị hợp lệ được giữ, mã cặp được chuẩn hóa như ô nhập', () => {
    const p = sanitizePrefs({ symbol: 'eth-usdt', interval: '1h', chartType: 'line', live: false, watchlist: ['btcusdt', 'ETHUSDT', 'ETHUSDT', ''], theme: 'dark' }, TF);
    assert.deepEqual(p, { symbol: 'ETHUSDT', interval: '1h', chartType: 'line', live: false, watchlist: ['BTCUSDT', 'ETHUSDT'], theme: 'dark' });
  });
  test('sai kiểu thì dùng mặc định từng khóa', () => {
    const p = sanitizePrefs({ symbol: 123, interval: '4h', chartType: 'pie', live: 'yes', watchlist: { 0: 'BTCUSDT' }, theme: { dark: true } }, TF);
    assert.deepEqual(p, DEFAULT_PREFS);
    assert.equal(sanitizePrefs({ symbol: '---' }, TF).symbol, DEFAULT_PREFS.symbol);
    assert.equal(sanitizePrefs({ interval: '1d' }, ['15m']).interval, '15m');
  });
  test('watchlist là mảng: bỏ phần tử không phải chuỗi; mảng rỗng (người dùng đã bỏ hết) được giữ', () => {
    assert.deepEqual(sanitizePrefs({ watchlist: [1, null, 'solusdt', {}] }, TF).watchlist, ['SOLUSDT']);
    assert.deepEqual(sanitizePrefs({ watchlist: [] }, TF).watchlist, []);
  });
  test('kết quả không dùng chung mảng mặc định', () => {
    const a = sanitizePrefs({}, TF);
    a.watchlist.push('X');
    assert.equal(DEFAULT_PREFS.watchlist.includes('X'), false);
  });
});
