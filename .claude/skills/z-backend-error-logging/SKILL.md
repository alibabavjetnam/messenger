---
name: z-backend-error-logging
description: "Xử lý lỗi và ghi log."
---

# z-backend-error-logging

Thuộc agent: `az-backend`

## Mục đích
Xử lý lỗi và ghi log.

## Các bước
1. Lỗi có mã và thông điệp rõ ràng.
2. Không trả stack trace cho client.
3. Log có cấu trúc, có request id; không log mật khẩu, token, API key.

## Đầu ra
Middleware lỗi/log + test.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
