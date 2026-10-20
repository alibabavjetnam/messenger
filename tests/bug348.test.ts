/** Test hồi quy BUG-3, BUG-4, BUG-8 (.az/bugs): đánh số lần tải, chỉ áp dụng kết quả mới nhất. */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { LoadSeq } from '../src/data/binance';

describe('BUG-3/4/8: chỉ áp dụng kết quả lần tải mới nhất', () => {
  test('lần tải cũ kết thúc sau lần tải mới thì bị bỏ (BUG-3, BUG-8)', () => {
    const seq = new LoadSeq();
    const a = seq.begin();
    const b = seq.begin();
    assert.equal(seq.isLatest(a), false);
    assert.equal(seq.isLatest(b), true);
  });
  test('dán tay hủy hiệu lực lần tải đang chạy (BUG-4)', () => {
    const seq = new LoadSeq();
    const a = seq.begin();
    seq.invalidate();
    assert.equal(seq.isLatest(a), false);
    const c = seq.current;
    assert.equal(seq.isLatest(c), true); // tác vụ bù dữ liệu lấy mốc hiện tại
    seq.begin();
    assert.equal(seq.isLatest(c), false);
  });
});
