/**
 * Dữ liệu tổng hợp tất định cho test (không gọi mạng, không dùng Math.random).
 */
import type { Candle } from '../src/core/types';

export const DAY = 86_400_000;
export const HOUR = 3_600_000;

/** PRNG mulberry32 có seed: cùng seed cho cùng dãy số trên mọi máy. */
export function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Bước ngẫu nhiên kiểu hình học: mỗi nến đổi giá drift ± 1%, râu tối đa 0.6%. */
export function genCandles(rnd: () => number, n: number, start: number, step: number, p0: number, drift: number): Candle[] {
  const out: Candle[] = [];
  let p = p0;
  for (let i = 0; i < n; i++) {
    const o = p;
    const c = o * (1 + drift + (rnd() - 0.5) * 0.02);
    const h = Math.max(o, c) * (1 + rnd() * 0.006);
    const l = Math.min(o, c) * (1 - rnd() * 0.006);
    out.push({ t: start + i * step, o, h, l, c, v: Math.round(rnd() * 1000) });
    p = c;
  }
  return out;
}

/** Ảnh gương giá quanh K: tăng ↔ giảm, đỉnh ↔ đáy (h' = K - l, l' = K - h). */
export function mirror(cs: Candle[], K: number): Candle[] {
  return cs.map((c) => ({ t: c.t, o: K - c.o, h: K - c.l, l: K - c.h, c: K - c.c, v: c.v }));
}

/** Bộ dữ liệu chuẩn cho backtest: D1 450 ngày + khung 1h 1000 nến bắt đầu từ ngày 380. */
export function market(seed: number, drift = 0.004) {
  const rnd = prng(seed);
  const t0 = Date.UTC(2023, 0, 1);
  const d1 = genCandles(rnd, 450, t0, DAY, 100, drift);
  const tf = genCandles(rnd, 1000, t0 + 380 * DAY, HOUR, d1[379].c, drift / 12);
  return { d1, tf };
}
