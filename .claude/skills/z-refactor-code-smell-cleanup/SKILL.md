---
name: z-refactor-code-smell-cleanup
description: "Dọn code smell."
---

# z-refactor-code-smell-cleanup

Thuộc agent: `az-refactor`

## Mục đích
Dọn code smell.

## Các bước
1. Tìm: code trùng lặp, hàm quá dài, quá nhiều tham số, tên khó hiểu, magic number.
2. Ưu tiên vùng hay bị sửa hoặc hay có lỗi.
3. Áp dụng z-refactor-safe-refactor cho từng thay đổi.

## Đầu ra
Danh sách smell đã xử lý trong report.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
