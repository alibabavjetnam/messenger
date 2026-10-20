/**
 * Test tích hợp src/main.ts (review T6, MINOR-2/MINOR-3): tải bù nến khi bật lại Realtime trên dữ liệu cũ,
 * và báo trên giao diện khi tải bù lỗi. DOM/fetch/WebSocket giả (tests/fakeDom.ts).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFakeDom } from './fakeDom';

const dom = installFakeDom();
await import('../src/main');
await dom.tick();
const klines = (from: number) => dom.fetchLog.slice(from).map((u) => /interval=\w+/.exec(u)![0]);

test('khởi động: tải tf + 1d rồi mở WebSocket', () => {
  assert.deepEqual(klines(0), ['interval=15m', 'interval=1d']);
  assert.equal(dom.sockets.length, 1);
  dom.sockets[0].onopen();
  assert.equal(dom.status(), 'live/Realtime');
});

test('MINOR-2: tắt rồi bật lại Realtime trên dữ liệu đã có thì tải bù nến qua REST khi kết nối xong', async () => {
  const lt = dom.$('liveToggle');
  lt.checked = false; dom.fire('liveToggle', 'change');
  assert.equal(dom.status(), 'static/Dữ liệu tĩnh');
  const before = dom.fetchLog.length;
  lt.checked = true; dom.fire('liveToggle', 'change');
  assert.equal(dom.sockets.length, 2);
  dom.sockets[1].onopen();
  await dom.tick();
  assert.deepEqual(klines(before), ['interval=15m', 'interval=1d']);
  assert.equal(dom.status(), 'live/Realtime');
  assert.equal(dom.$('notice').hidden, true);
});

test('MINOR-3: tải bù sau khi rớt mạng bị lỗi thì hiện cảnh báo trên notice', async () => {
  dom.sockets.at(-1).close(); // rớt mạng
  assert.equal(dom.status(), 'retrying/Đang kết nối lại');
  dom.net.up = false;
  dom.runTimers(); // hết thời gian chờ, kết nối lại
  dom.sockets.at(-1).onopen();
  await dom.tick();
  const n = dom.$('notice');
  assert.equal(n.hidden, false);
  assert.equal(n.dataset.kind, 'error');
  assert.match(n.innerHTML, /Không tải bù được/);
  dom.net.up = true;
});
