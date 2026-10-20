---
name: z-reviewer-acceptance-verify
description: "Xác nhận thay đổi đáp ứng acceptance criteria."
---

# z-reviewer-acceptance-verify

Thuộc agent: `az-reviewer`

## Mục đích
Xác nhận thay đổi đáp ứng acceptance criteria.

## Các bước
1. Đối chiếu từng tiêu chí với test/bằng chứng tương ứng.
2. Tiêu chí thiếu bằng chứng là BLOCKER.
3. Kết luận APPROVE hoặc REQUEST_CHANGES.

## Đầu ra
Verdict cuối trong report.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
