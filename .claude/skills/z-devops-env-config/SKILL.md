---
name: z-devops-env-config
description: "Quản lý cấu hình môi trường."
---

# z-devops-env-config

Thuộc agent: `az-devops`

## Mục đích
Quản lý cấu hình môi trường.

## Các bước
1. `.env.example` liệt kê đủ biến, giá trị giả.
2. Tách dev / staging / production.
3. Ứng dụng kiểm tra biến bắt buộc khi khởi động.
4. Secret không bao giờ vào git.

## Đầu ra
`.env.example` + tài liệu biến.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
