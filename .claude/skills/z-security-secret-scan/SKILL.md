---
name: z-security-secret-scan
description: "Quét secret bị lộ."
---

# z-security-secret-scan

Thuộc agent: `az-security`

## Mục đích
Quét secret bị lộ.

## Các bước
1. Grep các mẫu: api_key, secret, token, password, private key, chuỗi dài ngẫu nhiên.
2. Quét cả lịch sử git (gitleaks/trufflehog nếu có).
3. Kiểm tra `.env` có trong `.gitignore`.
4. Secret đã lộ: chỉ ghi vị trí, yêu cầu người dùng đổi key.

## Đầu ra
Danh sách vị trí lộ (không in giá trị).

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
