---
name: z-backend-third-party-integration
description: "Tích hợp dịch vụ bên ngoài (ví dụ API sàn giao dịch, thanh toán, email)."
---

# z-backend-third-party-integration

Thuộc agent: `az-backend`

## Mục đích
Tích hợp dịch vụ bên ngoài (ví dụ API sàn giao dịch, thanh toán, email).

## Các bước
1. Đọc tài liệu chính thức của dịch vụ.
2. Viết lớp client bọc riêng; timeout, retry có backoff, tôn trọng rate limit.
3. Đọc key từ biến môi trường.
4. Mock dịch vụ trong test; không gọi thật.

## Đầu ra
Client tích hợp + test với mock.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
