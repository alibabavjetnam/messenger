---
name: z-database-seed-data
description: "Tạo dữ liệu mẫu cho dev và test."
---

# z-database-seed-data

Thuộc agent: `az-database`

## Mục đích
Tạo dữ liệu mẫu cho dev và test.

## Các bước
1. Chỉ dùng dữ liệu giả.
2. Script chạy lại được nhiều lần (idempotent).
3. Phủ các trường hợp biên cần cho test.

## Đầu ra
Script seed.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
