---
name: z-security-dependency-cve
description: "Kiểm tra lỗ hổng thư viện."
---

# z-security-dependency-cve

Thuộc agent: `az-security`

## Mục đích
Kiểm tra lỗ hổng thư viện.

## Các bước
1. Chạy npm audit / pip-audit / tương đương.
2. Xếp mức độ, đề xuất phiên bản vá.

## Đầu ra
Bảng CVE + đề xuất.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
