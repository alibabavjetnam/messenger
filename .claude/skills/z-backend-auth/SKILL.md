---
name: z-backend-auth
description: "Xác thực và phân quyền."
---

# z-backend-auth

Thuộc agent: `az-backend`

## Mục đích
Xác thực và phân quyền.

## Các bước
1. Không tự viết thuật toán mã hóa; dùng thư viện chuẩn.
2. Hash mật khẩu bằng thuật toán chuyên dụng (bcrypt/argon2).
3. Kiểm tra quyền ở server cho từng request, chống truy cập dữ liệu người khác.
4. Token/session có thời hạn.

## Đầu ra
Module auth + test phân quyền.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
