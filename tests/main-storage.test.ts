/**
 * Test tích hợp src/main.ts (review T6, localStorage): giá trị đã lưu sai kiểu hoặc JSON hỏng
 * thì dùng mặc định, ứng dụng vẫn khởi động. DOM/fetch/WebSocket giả (tests/fakeDom.ts).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFakeDom } from './fakeDom';

const dom = installFakeDom();
dom.ls.set('4v2:symbol', '123');
dom.ls.set('4v2:interval', '{"x":1}');
dom.ls.set('4v2:chartType', '"pie"');
dom.ls.set('4v2:live', '"yes"');
dom.ls.set('4v2:watchlist', '{"0":"BTCUSDT"}');
dom.ls.set('4v2:theme', '{"dark":true}');
dom.ls.set('4v2:settings', '{hỏng');

test('localStorage hỏng: khởi động không lỗi, mọi giá trị về mặc định', async () => {
  await import('../src/main');
  await dom.tick();
  assert.equal(dom.$('symbolInput').value, 'BTCUSDT');
  assert.match(dom.fetchLog[0], /symbol=BTCUSDT&interval=15m/);
  assert.equal(dom.$('liveToggle').checked, true);
  assert.equal(dom.sockets.length, 1); // live mặc định bật
  const chips = [...dom.$('watchlist').innerHTML.matchAll(/data-pick="(\w+)"/g)].map((m) => m[1]);
  assert.deepEqual(chips, ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT']);
  assert.equal((globalThis as { document: { documentElement: { dataset: { theme?: string } } } }).document.documentElement.dataset.theme, undefined);
});
