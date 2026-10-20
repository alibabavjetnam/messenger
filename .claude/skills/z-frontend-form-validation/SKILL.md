---
name: z-frontend-form-validation
description: "Xây form và kiểm tra dữ liệu nhập."
---

# z-frontend-form-validation

Thuộc agent: `az-frontend`

## Mục đích
Xây form và kiểm tra dữ liệu nhập.

## Các bước
1. Validate phía client để cải thiện trải nghiệm (server vẫn phải validate).
2. Thông báo lỗi cụ thể cạnh trường bị lỗi.
3. Chống gửi trùng (disable khi đang gửi).

## Đầu ra
Form + test các trường hợp nhập sai.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
