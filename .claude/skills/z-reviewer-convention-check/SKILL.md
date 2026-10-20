---
name: z-reviewer-convention-check
description: "Đối chiếu convention."
---

# z-reviewer-convention-check

Thuộc agent: `az-reviewer`

## Mục đích
Đối chiếu convention.

## Các bước
1. So với `.az/conventions.md` và code xung quanh.
2. Đặt tên, cấu trúc, xử lý lỗi, cách viết test.

## Đầu ra
Nhận xét convention trong report.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
