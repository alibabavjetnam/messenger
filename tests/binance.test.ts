import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  FetchError, INTERVAL_MS, aggregateToDaily, fetchKlines, klinesUrl, parseRawCandles, upsertCandle,
} from '../src/data/binance';
import type { Candle } from '../src/core/types';
import { DAY, HOUR, genCandles, prng } from './fixtures';

const T = Date.UTC(2024, 0, 1); // 2024-01-01T00:00:00Z
const iso = (c: Candle[]) => c.map((x) => new Date(x.t).toISOString());

describe('parseRawCandles: JSON klines Binance', () => {
  test('đọc mảng klines, chuyển chuỗi số sang number, bỏ cột thừa', () => {
    const raw = JSON.stringify([
      [T, '42000.5', '42100', '41900.25', '42050', '12.5', T + 59_999, '1', 3, '0', '0', '0'],
      [T + 60_000, '42050', '42200', '42000', '42150', '8'],
    ]);
    assert.deepEqual(parseRawCandles(raw), [
      { t: T, o: 42000.5, h: 42100, l: 41900.25, c: 42050, v: 12.5 },
      { t: T + 60_000, o: 42050, h: 42200, l: 42000, c: 42150, v: 8 },
    ]);
  });
  test('sắp xếp theo thời gian, trùng t thì giữ dòng sau', () => {
    const raw = JSON.stringify([
      [T + 120_000, '3', '3', '3', '3', '1'],
      [T, '1', '1', '1', '1', '1'],
      [T + 60_000, '2', '2', '2', '2', '1'],
      [T, '9', '9', '9', '9', '9'],
    ]);
    const out = parseRawCandles(raw);
    assert.deepEqual(out.map((c) => c.t), [T, T + 60_000, T + 120_000]);
    assert.equal(out[0].o, 9);
  });
  test('bỏ dòng không hợp lệ, thiếu/sai volume thì v = 0', () => {
    const raw = JSON.stringify([
      [T, '1', '2', '0.5', '1.5'],
      [T + 60_000, 'x', '2', '0.5', '1.5', '1'],
      'không phải mảng',
      [T + 120_000, '1', '2', '0.5', '1.5', 'abc'],
    ]);
    const out = parseRawCandles(raw);
    assert.deepEqual(out.map((c) => [c.t, c.v]), [[T, 0], [T + 120_000, 0]]);
  });
});

describe('parseRawCandles: văn bản lẫn lộn chứa mảng nến', () => {
  test('trích các mảng [openTime, ...] trong văn bản', () => {
    const raw = `Kết quả: [${T},"1","2","0.5","1.5","10"] và tiếp
      ["${T + 60_000}","1.5","3","1","2","5"], hết.`;
    const out = parseRawCandles(raw);
    assert.deepEqual(out, [
      { t: T, o: 1, h: 2, l: 0.5, c: 1.5, v: 10 },
      { t: T + 60_000, o: 1.5, h: 3, l: 1, c: 2, v: 5 },
    ]);
  });
  test('JSON bị cắt dở vẫn đọc được các dòng hoàn chỉnh', () => {
    const raw = `[[${T},"1","2","0.5","1.5","10"],[${T + 60_000},"1.5","3","1","2","5"],[${T + 120_000},"2","`;
    assert.equal(parseRawCandles(raw).length, 2);
  });
});

describe('parseRawCandles: CSV', () => {
  test('thời gian ms, có dòng tiêu đề', () => {
    const out = parseRawCandles(`time,open,high,low,close,volume\n${T},1,2,0.5,1.5,10\n${T + HOUR},1.5,3,1,2,5`);
    assert.deepEqual(out, [
      { t: T, o: 1, h: 2, l: 0.5, c: 1.5, v: 10 },
      { t: T + HOUR, o: 1.5, h: 3, l: 1, c: 2, v: 5 },
    ]);
  });
  test('thời gian giây được đổi sang ms', () => {
    const out = parseRawCandles(`${T / 1000},1,2,0.5,1.5,10\n${T / 1000 + 60},1.5,3,1,2,5`);
    assert.deepEqual(out.map((c) => c.t), [T, T + 60_000]);
  });
  test('ngày dạng YYYY-MM-DD và ISO có Z hiểu theo UTC', () => {
    const out = parseRawCandles('2024-01-02,1,2,0.5,1.5,1\n2024-01-01T12:00:00Z,1,2,0.5,1.5,1\n2024-01-01,1,2,0.5,1.5,1');
    assert.deepEqual(iso(out), ['2024-01-01T00:00:00.000Z', '2024-01-01T12:00:00.000Z', '2024-01-02T00:00:00.000Z']);
  });
  test('dấu phân cách ; và tab, CRLF, ngoặc kép, thiếu volume', () => {
    const out = parseRawCandles(`"${T}";"1";"2";"0.5";"1.5";"7"\r\n${T + HOUR}\t1.5\t3\t1\t2\r\n`);
    assert.deepEqual(out, [
      { t: T, o: 1, h: 2, l: 0.5, c: 1.5, v: 7 },
      { t: T + HOUR, o: 1.5, h: 3, l: 1, c: 2, v: 0 },
    ]);
  });
  test('bỏ dòng thiếu cột hoặc sai số', () => {
    const out = parseRawCandles(`${T},1,2,0.5\n${T + HOUR},a,b,c,d\n${T + 2 * HOUR},1,2,0.5,1.5`);
    assert.deepEqual(out.map((c) => c.t), [T + 2 * HOUR]);
  });
});

describe('parseRawCandles: lỗi', () => {
  test('rỗng hoặc chỉ khoảng trắng', () => {
    assert.throws(() => parseRawCandles(''), { message: 'Ô dữ liệu đang trống.' });
    assert.throws(() => parseRawCandles('  \n\t '), { message: 'Ô dữ liệu đang trống.' });
  });
  test('không nhận ra định dạng', () => {
    for (const raw of ['xin chào', '[]', '{"a":1}', '[[1,2,3]]', 'a,b,c,d,e']) {
      assert.throws(() => parseRawCandles(raw), /Không nhận ra định dạng/, raw);
    }
  });
});

describe('aggregateToDaily: gộp theo ngày UTC', () => {
  test('72 nến 1h từ 00:00Z thành 3 nến ngày: o đầu, c cuối, h max, l min, v cộng', () => {
    const h1 = genCandles(prng(9), 72, T, HOUR, 100, 0);
    const d = aggregateToDaily(h1);
    assert.deepEqual(iso(d), ['2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z', '2024-01-03T00:00:00.000Z']);
    d.forEach((x, k) => {
      const part = h1.slice(k * 24, k * 24 + 24);
      assert.equal(x.o, part[0].o);
      assert.equal(x.c, part[23].c);
      assert.equal(x.h, Math.max(...part.map((p) => p.h)));
      assert.equal(x.l, Math.min(...part.map((p) => p.l)));
      assert.equal(x.v, part.reduce((a, p) => a + p.v, 0));
    });
  });
  test('ranh giới là 00:00 UTC: 23:45Z thuộc ngày cũ, 00:00Z sang ngày mới', () => {
    const mk = (t: number, p: number): Candle => ({ t, o: p, h: p + 1, l: p - 1, c: p, v: 1 });
    const d = aggregateToDaily([mk(T + DAY - 15 * 60_000, 10), mk(T + DAY, 20), mk(T + DAY + 15 * 60_000, 30)]);
    assert.deepEqual(d, [
      { t: T, o: 10, h: 11, l: 9, c: 10, v: 1 },
      { t: T + DAY, o: 20, h: 31, l: 19, c: 30, v: 2 },
    ]);
  });
  test('không sửa mảng đầu vào; nến ngày gộp lại là chính nó', () => {
    const d1 = genCandles(prng(10), 5, T, DAY, 100, 0);
    const copy = d1.map((c) => ({ ...c }));
    assert.deepEqual(aggregateToDaily(d1), copy);
    assert.deepEqual(d1, copy);
    assert.notEqual(aggregateToDaily(d1)[0], d1[0]);
  });
  test('mảng rỗng', () => {
    assert.deepEqual(aggregateToDaily([]), []);
  });
});

describe('upsertCandle', () => {
  const c = (t: number, p = 1): Candle => ({ t, o: p, h: p, l: p, c: p, v: 0 });
  test('thêm nến mới, thay nến cùng t, bỏ qua nến cũ hơn', () => {
    const list: Candle[] = [];
    upsertCandle(list, c(0));
    upsertCandle(list, c(60_000));
    upsertCandle(list, c(60_000, 5));
    upsertCandle(list, c(0, 9));
    assert.deepEqual(list, [c(0), c(60_000, 5)]);
  });
  test('giữ tối đa max nến (cắt phía đầu)', () => {
    const list = [c(0), c(1), c(2)];
    upsertCandle(list, c(3), 3);
    assert.deepEqual(list.map((x) => x.t), [1, 2, 3]);
  });
});

describe('klinesUrl / INTERVAL_MS', () => {
  test('dựng URL và mã hóa symbol', () => {
    assert.equal(klinesUrl('https://h', 'BTCUSDT', '15m', 1000), 'https://h/api/v3/klines?symbol=BTCUSDT&interval=15m&limit=1000');
    assert.equal(klinesUrl('https://h', 'A&B', '1d', 5), 'https://h/api/v3/klines?symbol=A%26B&interval=1d&limit=5');
  });
  test('độ dài khung', () => {
    assert.equal(INTERVAL_MS['1m'], 60_000);
    assert.equal(INTERVAL_MS['15m'], 900_000);
    assert.equal(INTERVAL_MS['4h'], 4 * HOUR);
    assert.equal(INTERVAL_MS['1d'], DAY);
  });
});

describe('fetchKlines (fetch được mock, không gọi mạng)', () => {
  const realFetch = globalThis.fetch;
  afterEach(() => { globalThis.fetch = realFetch; });
  const calls: string[] = [];
  const mockFetch = (handler: (url: string, init?: RequestInit) => Promise<Response>) => {
    calls.length = 0;
    globalThis.fetch = (async (url: string, init?: RequestInit) => { calls.push(String(url)); return handler(String(url), init); }) as typeof fetch;
  };
  const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });
  const row = [T, '1', '2', '0.5', '1.5', '10'];

  test('máy chủ đầu lỗi HTTP 500 thì chuyển sang máy chủ kế tiếp', async () => {
    mockFetch(async (url) => (url.startsWith('https://api.binance.com') ? new Response('x', { status: 500 }) : ok([row])));
    const out = await fetchKlines('BTCUSDT', '1h', 10);
    assert.deepEqual(out, [{ t: T, o: 1, h: 2, l: 0.5, c: 1.5, v: 10 }]);
    assert.deepEqual(calls, [
      'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=10',
      'https://data-api.binance.vision/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=10',
    ]);
  });

  test('400 Invalid symbol: dừng ngay, ném FetchError', async () => {
    mockFetch(async () => new Response('{"code":-1121,"msg":"Invalid symbol."}', { status: 400 }));
    await assert.rejects(fetchKlines('XYZ', '1h'), (e: unknown) => {
      assert.ok(e instanceof FetchError);
      assert.equal(e.message, 'Binance không có cặp XYZ.');
      assert.deepEqual(e.attempts, ['https://api.binance.com: 400']);
      return true;
    });
    assert.equal(calls.length, 1);
  });

  test('mọi máy chủ lỗi: FetchError liệt kê 5 lần thử', async () => {
    let k = 0;
    mockFetch(async () => {
      k++;
      if (k === 1) throw new TypeError('Failed to fetch');
      if (k === 2) return ok([]);
      return new Response('', { status: 503 });
    });
    await assert.rejects(fetchKlines('BTCUSDT', '1h'), (e: unknown) => {
      assert.ok(e instanceof FetchError);
      assert.equal(e.message, 'Không tải được dữ liệu từ Binance.');
      assert.equal(e.attempts.length, 5);
      assert.equal(e.attempts[0], 'https://api.binance.com: Failed to fetch');
      assert.equal(e.attempts[1], 'https://data-api.binance.vision: không có dữ liệu');
      assert.equal(e.attempts[2], 'https://api1.binance.com: HTTP 503');
      return true;
    });
  });

  test('hết thời gian chờ thì hủy và thử máy chủ sau', async () => {
    let k = 0;
    mockFetch((_url, init) => {
      k++;
      if (k > 1) return Promise.resolve(ok([row]));
      return new Promise((_, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
      });
    });
    const out = await fetchKlines('BTCUSDT', '1h', 10, 20);
    assert.equal(out.length, 1);
    assert.equal(calls.length, 2);
  });
});
