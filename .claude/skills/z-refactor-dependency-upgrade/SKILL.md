---
name: z-refactor-dependency-upgrade
description: "Nâng cấp thư viện."
---

# z-refactor-dependency-upgrade

Thuộc agent: `az-refactor`

## Mục đích
Nâng cấp thư viện.

## Các bước
1. Đọc changelog / migration guide của thư viện.
2. Nâng từng thư viện một, không nâng hàng loạt.
3. Sửa breaking change; chạy test; cập nhật lock file.

## Đầu ra
Lock file mới + report thay đổi.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
