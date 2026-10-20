/**
 * Test tích hợp src/main.ts (review T8, MAJOR-1): bật Realtime trong lúc đang tải cặp/khung mới
 * không được gộp nến của cặp/khung cũ vào dữ liệu mới. DOM/fetch/WebSocket giả (tests/fakeDom.ts).
 * Mỗi cặp/khung có một mức giá riêng để nhận ra nến lạc vào chuỗi.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFakeDom } from './fakeDom';

const dom = installFakeDom();
const g = globalThis as any;
const opts: any[] = [];
g.echarts = { init: () => ({ setOption(o: unknown) { opts.push(o); }, resize() {}, dispose() {} }) };
dom.ls.set('4v2:live', 'false');

const PRICE: Record<string, number> = { 'BTCUSDT 15m': 50001, 'ETHUSDT 15m': 3002, 'ETHUSDT 1h': 4003 };
const realFetch = g.fetch;
const pending: { url: string; go: () => void }[] = [];
let hold = false;
g.fetch = (url: string) => {
  const key = `${/symbol=(\w+)/.exec(url)![1]} ${/interval=(\w+)/.exec(url)![1]}`;
  const p = PRICE[key] ?? 7;
  const mk = async () => {
    const r = await realFetch(url);
    const rows = (await r.json()) as unknown[][];
    return { ...r, json: async () => rows.map((x) => [x[0], String(p), String(p), String(p), String(p), '1']) };
  };
  if (!hold) return mk();
  return new Promise((res) => pending.push({ url, go: () => res(mk()) }));
};
const release = async () => { pending.splice(0).forEach((p) => p.go()); await dom.tick(); };
const key = (u: string) => `${/symbol=(\w+)/.exec(u)![1]} ${/interval=(\w+)/.exec(u)![1]}`;
/** Giá đóng cửa của mọi nến trên biểu đồ khung giao dịch lần vẽ gần nhất. */
const chartCloses = () => {
  const s = (opts.at(-1).series as any[]).find((x) => x.name === 'Giá');
  return new Set((s.data as number[][]).map((d) => d[1]));
};

await import('../src/main');
await dom.tick();

/** Bật Realtime trong lúc lần tải đang chờ REST, rồi cho REST trả về: lần tải mới trước, tải bù (nếu có) sau. */
async function toggleLiveWhileLoading(start: () => void) {
  hold = true;
  start();
  const sockets = dom.sockets.length;
  const lt = dom.$('liveToggle');
  lt.checked = true; dom.fire('liveToggle', 'change');
  // Nếu có WebSocket mới mở ngay (dữ liệu cũ) thì cho nó kết nối xong để tải bù chạy
  if (dom.sockets.length > sockets) { dom.sockets.at(-1).onopen(); await dom.tick(); }
  const loadReqs = pending.splice(0, 2);
  const others = pending.splice(0);
  loadReqs.forEach((p) => p.go()); await dom.tick();
  others.forEach((p) => p.go()); await dom.tick();
  hold = false;
  return { loadReqs: loadReqs.map((p) => key(p.url)), others: others.map((p) => key(p.url)) };
}

test('khởi động: BTCUSDT 15m, Realtime tắt', () => {
  assert.equal(dom.status(), 'static/Dữ liệu tĩnh');
  assert.deepEqual([...chartCloses()], [50001]);
});

test('MAJOR-1: đổi cặp rồi bật Realtime khi đang tải: không gộp nến cặp cũ, Realtime mở cho cặp mới khi tải xong', async () => {
  const r = await toggleLiveWhileLoading(() => {
    dom.$('symbolInput').value = 'ETHUSDT';
    dom.fire('symbolInput', 'change', { target: dom.$('symbolInput') });
  });
  assert.deepEqual(r.loadReqs, ['ETHUSDT 15m', 'ETHUSDT 1d']);
  assert.deepEqual([...chartCloses()], [3002]);
  assert.match(dom.sockets.at(-1).url, /streams=ethusdt@kline_15m\/ethusdt@kline_1d$/);
  dom.sockets.at(-1).onopen();
  await dom.tick();
  assert.equal(dom.status(), 'live/Realtime');
  assert.deepEqual([...chartCloses()], [3002]);
});

test('MAJOR-1: đổi khung rồi bật Realtime khi đang tải: không chèn nến khung cũ vào khung mới', async () => {
  const lt = dom.$('liveToggle');
  lt.checked = false; dom.fire('liveToggle', 'change');
  assert.equal(dom.status(), 'static/Dữ liệu tĩnh');
  const tfBtn = { closest: () => ({ dataset: { tf: '1h' } }) };
  const r = await toggleLiveWhileLoading(() => dom.fire('tfGroup', 'click', { target: tfBtn }));
  assert.deepEqual(r.loadReqs, ['ETHUSDT 1h', 'ETHUSDT 1d']);
  assert.deepEqual([...chartCloses()], [4003]);
  assert.match(dom.sockets.at(-1).url, /streams=ethusdt@kline_1h\/ethusdt@kline_1d$/);
  dom.sockets.at(-1).onopen();
  await dom.tick();
  assert.equal(dom.status(), 'live/Realtime');
  assert.deepEqual([...chartCloses()], [4003]);
});

test('tắt Realtime khi đang tải: lần tải xong để dữ liệu tĩnh, không mở WebSocket', async () => {
  hold = true;
  dom.$('reloadBtn').listeners.click[0]();
  assert.equal(dom.status(), 'loading/Đang tải');
  const sockets = dom.sockets.length;
  const lt = dom.$('liveToggle');
  lt.checked = false; dom.fire('liveToggle', 'change');
  assert.equal(dom.status(), 'loading/Đang tải');
  hold = false;
  await release();
  assert.equal(dom.sockets.length, sockets);
  assert.equal(dom.status(), 'static/Dữ liệu tĩnh');
});
