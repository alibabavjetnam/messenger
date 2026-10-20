---
name: z-refactor-dead-code-removal
description: "Xóa code không còn dùng."
---

# z-refactor-dead-code-removal

Thuộc agent: `az-refactor`

## Mục đích
Xóa code không còn dùng.

## Các bước
1. Grep xác nhận không còn nơi gọi, kể cả gọi động, cấu hình, route, template.
2. Xóa và chạy toàn bộ test.
3. Ghi lại thứ đã xóa trong report.

## Đầu ra
Diff xóa + output test.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
