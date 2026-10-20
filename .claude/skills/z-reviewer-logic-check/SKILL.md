---
name: z-reviewer-logic-check
description: "Soát lỗi logic."
---

# z-reviewer-logic-check

Thuộc agent: `az-reviewer`

## Mục đích
Soát lỗi logic.

## Các bước
1. Kiểm: điều kiện biên, null, lỗi không được xử lý, off-by-one.
2. Kiểm: race condition, sai đơn vị, làm tròn số, múi giờ.
3. Kiểm: thay đổi có làm hỏng nơi gọi khác không.

## Đầu ra
Nhận xét logic trong report.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
