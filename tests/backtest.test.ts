import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildSeries } from '../src/core/indicators';
import { runBacktest } from '../src/core/backtest';
import { DEFAULT_SETTINGS, type BacktestResult, type Candle, type Trade } from '../src/core/types';
import { DAY, HOUR, market, mirror } from './fixtures';

const cfg = DEFAULT_SETTINGS;
const run = (tf: Candle[], d1: Candle[], c = cfg) => runBacktest(buildSeries(tf), buildSeries(d1), HOUR, c);
const brief = (b: BacktestResult) => b.trades.map((t) => [t.channel, t.direction, t.entryIdx, t.exitIdx, t.result]);

const UP = market(12, 0.004); // dữ liệu tăng: lệnh BUY ở cả 2 kênh
const DOWN = market(5, -0.004); // dữ liệu giảm: lệnh SELL ở cả 2 kênh
const btUp = run(UP.tf, UP.d1);
const btDown = run(DOWN.tf, DOWN.d1);

describe('backtest: ảnh chụp hành vi hiện tại (characterization)', () => {
  test('seed 12 tăng: danh sách lệnh và thống kê', () => {
    assert.deepEqual(brief(btUp), [
      ['counter', 'BUY', 210, 470, 'loss'],
      ['with', 'BUY', 215, 806, 'win'],
      ['counter', 'BUY', 654, 661, 'win'],
      ['counter', 'BUY', 673, 687, 'win'],
      ['counter', 'BUY', 868, 882, 'loss'],
      ['counter', 'BUY', 886, 910, 'win'],
      ['counter', 'BUY', 919, 940, 'loss'],
      ['counter', 'BUY', 964, 973, 'win'],
      ['with', 'BUY', 978, null, 'open'],
    ]);
    assert.deepEqual(btUp.byChannel.with, { total: 1, wins: 1, losses: 0, open: 1, winRate: 100, netR: 1.5 });
    assert.deepEqual(btUp.byChannel.counter, { total: 7, wins: 4, losses: 3, open: 0, winRate: (4 / 7) * 100, netR: 3 });
    assert.deepEqual(btUp.all, { total: 8, wins: 5, losses: 3, open: 1, winRate: 62.5, netR: 4.5 });
  });

  test('seed 5 giảm: danh sách lệnh và thống kê', () => {
    assert.deepEqual(brief(btDown), [
      ['counter', 'SELL', 484, 517, 'win'],
      ['with', 'SELL', 493, 569, 'win'],
      ['counter', 'SELL', 538, 544, 'win'],
      ['counter', 'SELL', 694, 699, 'win'],
      ['with', 'SELL', 698, 716, 'loss'],
      ['counter', 'SELL', 713, 716, 'loss'],
    ]);
    assert.deepEqual(btDown.byChannel.with, { total: 2, wins: 1, losses: 1, open: 0, winRate: 50, netR: 0.5 });
    assert.deepEqual(btDown.byChannel.counter, { total: 4, wins: 3, losses: 1, open: 0, winRate: 75, netR: 3.5 });
    assert.deepEqual(btDown.all, { total: 6, wins: 4, losses: 2, open: 0, winRate: (4 / 6) * 100, netR: 4 });
  });
});

describe('backtest: quy tắc vào/ra lệnh', () => {
  const check = (tf: Candle[], t: Trade, rr = cfg.rr) => {
    const buy = t.direction === 'BUY';
    assert.equal(t.entry, tf[t.entryIdx].c, 'vào lệnh ở giá đóng cửa nến tín hiệu');
    assert.equal(t.entryTime, tf[t.entryIdx].t);
    const risk = buy ? t.entry - t.stopLoss : t.stopLoss - t.entry;
    assert.ok(risk > 0);
    assert.ok(Math.abs(t.takeProfit - (buy ? t.entry + rr * risk : t.entry - rr * risk)) < 1e-9);
    const hitSL = (c: Candle) => (buy ? c.l <= t.stopLoss : c.h >= t.stopLoss);
    const hitTP = (c: Candle) => (buy ? c.h >= t.takeProfit : c.l <= t.takeProfit);
    const last = t.exitIdx ?? tf.length;
    for (let j = t.entryIdx + 1; j < last; j++) assert.ok(!hitSL(tf[j]) && !hitTP(tf[j]), `chạm sớm ở ${j}`);
    if (t.exitIdx === null) { assert.equal(t.result, 'open'); assert.equal(t.exitTime, null); return; }
    const x = tf[t.exitIdx];
    assert.equal(t.exitTime, x.t);
    assert.equal(t.result, hitSL(x) ? 'loss' : 'win');
    assert.ok(hitSL(x) || hitTP(x));
  };

  test('entry = close, TP = rr × rủi ro, thoát ở nến đầu tiên chạm SL/TP', () => {
    for (const t of btUp.trades) check(UP.tf, t);
    for (const t of btDown.trades) check(DOWN.tf, t);
  });

  test('mỗi kênh chỉ 1 lệnh tại một thời điểm', () => {
    for (const bt of [btUp, btDown]) {
      for (const ch of ['with', 'counter'] as const) {
        const list = bt.trades.filter((t) => t.channel === ch);
        for (let k = 1; k < list.length; k++) {
          assert.notEqual(list[k - 1].exitIdx, null);
          assert.ok(list[k].entryIdx > (list[k - 1].exitIdx as number), `${ch} #${k}`);
        }
      }
    }
  });

  test('không vào lệnh trước warmup và ở nến cuối', () => {
    for (const t of [...btUp.trades, ...btDown.trades]) {
      assert.ok(t.entryIdx >= 210 && t.entryIdx < UP.tf.length - 1);
    }
    const late = runBacktest(buildSeries(UP.tf), buildSeries(UP.d1), HOUR, cfg, 700);
    assert.deepEqual(brief(late).filter((x) => (x[2] as number) < 700), []);
    assert.ok(late.trades.length > 0);
  });

  test('thống kê: netR = wins×rr − losses, winRate theo lệnh đã đóng, all = tổng 2 kênh', () => {
    for (const rr of [1, 2, 3]) {
      const bt = run(UP.tf, UP.d1, { ...cfg, rr });
      const { all, byChannel } = bt;
      assert.equal(all.netR, all.wins * rr - all.losses);
      assert.equal(all.total, all.wins + all.losses);
      assert.equal(all.total + all.open, bt.trades.length);
      assert.equal(all.winRate, all.total ? (all.wins / all.total) * 100 : 0);
      assert.equal(all.wins, byChannel.with.wins + byChannel.counter.wins);
      assert.equal(all.losses, byChannel.with.losses + byChannel.counter.losses);
      for (const t of bt.trades) check(UP.tf, t, rr); // TP theo rr mới
    }
  });

  test('D1 chưa đủ dữ liệu (SIDEWAYS) thì không có lệnh', () => {
    const bt = run(UP.tf, UP.d1.slice(350, 400));
    assert.equal(bt.trades.length, 0);
    assert.deepEqual(bt.all, { total: 0, wins: 0, losses: 0, open: 0, winRate: 0, netR: 0 });
  });
});

describe('backtest: nến chạm cả SL và TP tính là thua', () => {
  const t0 = btUp.trades[2]; // counter BUY vào ở 654
  const j = t0.entryIdx + 1;
  const withBar = (h: number, l: number) => {
    const tf = UP.tf.map((c) => ({ ...c }));
    const e = t0.entry;
    tf[j] = { ...tf[j], o: e, c: e, h, l };
    return tf;
  };
  const find = (bt: BacktestResult) => bt.trades.find((t) => t.channel === t0.channel && t.entryIdx === t0.entryIdx)!;

  test('nến kế tiếp chạm cả hai: loss tại nến đó', () => {
    const t = find(run(withBar(t0.takeProfit + 1, t0.stopLoss - 1), UP.d1));
    assert.deepEqual([t.exitIdx, t.result], [j, 'loss']);
    assert.equal(t.takeProfit, t0.takeProfit);
  });
  test('chạm đúng biên cả hai (<=, >=) vẫn là loss', () => {
    const t = find(run(withBar(t0.takeProfit, t0.stopLoss), UP.d1));
    assert.deepEqual([t.exitIdx, t.result], [j, 'loss']);
  });
  test('chỉ chạm TP: win; chỉ chạm SL: loss', () => {
    const mid = (t0.entry + t0.stopLoss) / 2;
    const win = find(run(withBar(t0.takeProfit, mid), UP.d1));
    assert.deepEqual([win.exitIdx, win.result], [j, 'win']);
    const loss = find(run(withBar(t0.entry, t0.stopLoss), UP.d1));
    assert.deepEqual([loss.exitIdx, loss.result], [j, 'loss']);
  });
  test('SELL: nến chạm cả hai cũng là loss', () => {
    const s0 = btDown.trades[0];
    const tf = DOWN.tf.map((c) => ({ ...c }));
    tf[s0.entryIdx + 1] = { ...tf[s0.entryIdx + 1], o: s0.entry, c: s0.entry, h: s0.stopLoss + 0.01, l: s0.takeProfit - 0.01 };
    const t = run(tf, DOWN.d1).trades.find((x) => x.channel === s0.channel && x.entryIdx === s0.entryIdx)!;
    assert.deepEqual([t.exitIdx, t.result], [s0.entryIdx + 1, 'loss']);
  });
});

describe('backtest: không nhìn trước tương lai', () => {
  const entries = (b: BacktestResult, before: number) =>
    b.trades.filter((t) => t.entryIdx < before).map((t) => [t.channel, t.direction, t.entryIdx, t.entry, t.stopLoss, t.takeProfit]);

  test('backtest trên tiền tố nến khung giao dịch cho cùng các lệnh', () => {
    for (const cut of [500, 700, 900]) {
      for (const mk of [UP, DOWN]) {
        const full = run(mk.tf, mk.d1);
        const pre = run(mk.tf.slice(0, cut), mk.d1);
        assert.deepEqual(entries(pre, cut - 1), entries(full, cut - 1), `cut=${cut}`);
        assert.ok(entries(full, cut - 1).length > 0 || cut === 500);
      }
    }
  });

  test('đổi nến khung giao dịch tương lai không đổi các lệnh trước đó', () => {
    const tf = UP.tf.map((c, k) => (k >= 800 ? { ...c, o: c.o * 0.7, h: c.h * 0.7, l: c.l * 0.6, c: c.c * 0.65 } : c));
    assert.deepEqual(entries(run(tf, UP.d1), 800), entries(btUp, 800));
  });

  test('D1 chỉ dùng nến ngày đã đóng: đổi các ngày chưa đóng không đổi lệnh', () => {
    for (const mk of [UP, DOWN]) {
      const bt = run(mk.tf, mk.d1);
      for (const t of bt.trades) {
        const barClose = mk.tf[t.entryIdx].t + HOUR;
        // ngày đầu tiên chưa đóng tại thời điểm nến tín hiệu đóng
        const X = mk.d1.findIndex((d) => d.t + DAY > barClose);
        const d1 = mk.d1.map((d, k) => (k >= X ? { ...d, o: 1, h: 1.01, l: 0.99, c: 1 } : d));
        const again = run(mk.tf, d1);
        assert.deepEqual(entries(again, t.entryIdx + 1), entries(bt, t.entryIdx + 1), `entry ${t.entryIdx}`);
      }
    }
  });

  test('chỉ cần các ngày có t + DAY <= barClose: cắt D1 tới đó cho cùng lệnh tại nến tín hiệu', () => {
    for (const t of btUp.trades) {
      const barClose = UP.tf[t.entryIdx].t + HOUR;
      const lastClosed = UP.d1.filter((d) => d.t + DAY <= barClose).length;
      const cutD1 = run(UP.tf.slice(0, t.entryIdx + 2), UP.d1.slice(0, lastClosed));
      assert.deepEqual(entries(cutD1, t.entryIdx + 1), entries(btUp, t.entryIdx + 1), `entry ${t.entryIdx}`);
    }
  });
});

describe('backtest: đối xứng mua/bán', () => {
  test('dữ liệu lật (K - giá) cho cùng lệnh, hướng ngược lại, SL/TP lật', () => {
    const K = 10_000;
    for (const mk of [UP, DOWN]) {
      const a = run(mk.tf, mk.d1);
      const b = run(mirror(mk.tf, K), mirror(mk.d1, K));
      assert.ok(a.trades.length > 0);
      assert.equal(b.trades.length, a.trades.length);
      a.trades.forEach((x, k) => {
        const y = b.trades[k];
        assert.deepEqual([y.channel, y.entryIdx, y.exitIdx, y.result], [x.channel, x.entryIdx, x.exitIdx, x.result]);
        assert.equal(y.direction, x.direction === 'BUY' ? 'SELL' : 'BUY');
        assert.equal(y.entry, K - x.entry);
        assert.equal(y.stopLoss, K - x.stopLoss);
        assert.ok(Math.abs(y.takeProfit - (K - x.takeProfit)) < 1e-6);
      });
      assert.deepEqual(b.byChannel, a.byChannel);
    }
  });
});
