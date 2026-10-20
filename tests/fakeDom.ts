/**
 * DOM, localStorage, fetch, WebSocket và window.setTimeout giả để chạy src/main.ts trong node (không gọi mạng).
 * Gọi installFakeDom() trước khi `await import('../src/main')`.
 */
export const H = 3_600_000, M15 = 900_000, DAY = 86_400_000;

type Res = { ok: boolean; status: number; json: () => Promise<unknown>; text: () => Promise<string> };

export function installFakeDom() {
  const g = globalThis as any;
  const els = new Map<string, any>();
  const mkEl = (id: string) => {
    const attrs = new Map<string, string>();
    const listeners: Record<string, ((e?: unknown) => void)[]> = {};
    const span = { textContent: '' };
    return {
      id, innerHTML: '', hidden: false, dataset: {} as Record<string, string>, value: '', checked: false, open: false,
      textContent: '', title: '', href: '', clientWidth: 1000, span, listeners,
      setAttribute: (k: string, v: string) => attrs.set(k, v), removeAttribute: (k: string) => attrs.delete(k),
      hasAttribute: (k: string) => attrs.has(k),
      addEventListener: (t: string, f: (e?: unknown) => void) => { (listeners[t] ||= []).push(f); },
      querySelector: () => span,
    };
  };
  const $ = (id: string) => { if (!els.has(id)) els.set(id, mkEl(id)); return els.get(id); };
  g.document = {
    getElementById: $, querySelectorAll: () => [], documentElement: { dataset: {} },
    addEventListener: () => {}, visibilityState: 'visible', title: '',
  };
  // window.setTimeout giả: chỉ chạy khi test gọi runTimers()
  const timers = new Map<number, () => void>();
  let tid = 0;
  g.window = {
    setTimeout: (f: () => void) => { timers.set(++tid, f); return tid; },
    clearTimeout: (id: number) => { timers.delete(id); },
    matchMedia: () => ({ addEventListener() {} }),
  };
  const ls = new Map<string, string>();
  g.localStorage = { getItem: (k: string) => ls.get(k) ?? null, setItem: (k: string, v: string) => ls.set(k, v) };
  g.echarts = { init: () => ({ setOption() {}, resize() {}, dispose() {} }) };
  g.ResizeObserver = class { observe() {} disconnect() {} };
  g.getComputedStyle = () => ({ getPropertyValue: () => '#000', colorScheme: 'light' });
  const sockets: any[] = [];
  g.WebSocket = class {
    onopen: (() => void) | null = null; onclose: (() => void) | null = null;
    onmessage: ((e: unknown) => void) | null = null; onerror: (() => void) | null = null;
    constructor(public url: string) { sockets.push(this); }
    close() { this.onclose?.(); }
  };
  const now = Date.now();
  const rows = (step: number, n: number, base: number) => {
    const end = Math.floor(now / step) * step;
    return Array.from({ length: n }, (_, k) => {
      const c = base + Math.sin(k / 7) * base * 0.02;
      return [end - (n - 1 - k) * step, String(c), String(c * 1.01), String(c * 0.99), String(c), '1'];
    });
  };
  const stepOf = (u: string) => ({ '15m': M15, '1h': H, '4h': 4 * H, '1d': DAY } as Record<string, number>)[/interval=(\w+)/.exec(u)![1]];
  const fetchLog: string[] = [];
  const net = {
    /** true: trả dữ liệu hợp lệ; false: mọi máy chủ trả HTTP 500. */
    up: true,
  };
  g.fetch = async (url: string): Promise<Res> => {
    fetchLog.push(url);
    if (!net.up) return { ok: false, status: 500, json: async () => ({}), text: async () => '' };
    return { ok: true, status: 200, json: async () => rows(stepOf(url), 300, 100), text: async () => '' };
  };
  const runTimers = () => { const fs = [...timers.values()]; timers.clear(); fs.forEach((f) => f()); };
  const tick = () => new Promise((r) => setTimeout(r, 10));
  const fire = (id: string, type: string, e: unknown = {}) => { for (const f of $(id).listeners[type] || []) f(e); };
  const status = () => `${$('status').dataset.state}/${$('status').span.textContent}`;
  return { $, ls, sockets, fetchLog, net, runTimers, tick, fire, status };
}
