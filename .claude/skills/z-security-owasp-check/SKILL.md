---
name: z-security-owasp-check
description: "Kiểm tra theo OWASP Top 10."
---

# z-security-owasp-check

Thuộc agent: `az-security`

## Mục đích
Kiểm tra theo OWASP Top 10.

## Các bước
1. Injection, XSS, SSRF, CSRF.
2. Kiểm soát truy cập, cấu hình sai, thành phần lỗi thời.
3. Lỗi lộ thông tin qua thông báo lỗi.

## Đầu ra
Danh sách rủi ro theo mức độ.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
