---
name: z-frontend-api-integration
description: "Kết nối giao diện với API theo contract."
---

# z-frontend-api-integration

Thuộc agent: `az-frontend`

## Mục đích
Kết nối giao diện với API theo contract.

## Các bước
1. Tách lớp gọi API riêng khỏi component.
2. Xử lý lỗi mạng, timeout, mã lỗi từ server.
3. Không đặt API key bí mật ở client.

## Đầu ra
Lớp API client + test với mock.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
