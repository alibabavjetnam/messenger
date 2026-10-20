---
name: z-explorer-convention-extraction
description: "Rút ra coding convention đang dùng để code mới khớp code cũ."
---

# z-explorer-convention-extraction

Thuộc agent: `az-explorer`

## Mục đích
Rút ra coding convention đang dùng để code mới khớp code cũ.

## Các bước
1. Đọc 3–5 file tiêu biểu ở các tầng khác nhau.
2. Ghi: cách đặt tên, cấu trúc file, xử lý lỗi, log, cách viết test.
3. Đọc cấu hình lint/format (eslint, prettier, ruff, black…).

## Đầu ra
`.az/conventions.md`.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
