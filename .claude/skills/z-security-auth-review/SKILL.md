---
name: z-security-auth-review
description: "Soát xác thực và phân quyền."
---

# z-security-auth-review

Thuộc agent: `az-security`

## Mục đích
Soát xác thực và phân quyền.

## Các bước
1. Mọi endpoint nhạy cảm đều kiểm quyền ở server.
2. Chống IDOR (truy cập dữ liệu người khác qua id).
3. Token có hạn, mật khẩu được hash đúng.

## Đầu ra
Nhận xét auth trong report.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
