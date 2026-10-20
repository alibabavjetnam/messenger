---
name: z-explorer-env-setup
description: "Cài đặt và chạy được ứng dụng ở local, lấy baseline test."
---

# z-explorer-env-setup

Thuộc agent: `az-explorer`

## Mục đích
Cài đặt và chạy được ứng dụng ở local, lấy baseline test.

## Các bước
1. Cài dependency theo lock file.
2. Tạo `.env` từ `.env.example` với giá trị giả; ghi rõ biến nào cần người dùng cung cấp giá trị thật.
3. Chạy ứng dụng và toàn bộ test hiện có.
4. Ghi baseline: số test pass/fail TRƯỚC khi sửa.

## Đầu ra
`.az/codebase-map.md` mục 'Chạy local & baseline'.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
