---
name: z-debugger-hotfix
description: "Sửa khẩn cấp lỗi nghiêm trọng trên production."
---

# z-debugger-hotfix

Thuộc agent: `az-debugger`

## Mục đích
Sửa khẩn cấp lỗi nghiêm trọng trên production.

## Các bước
1. Chỉ dùng cho lỗi S1.
2. Tạo nhánh hotfix từ bản đang chạy.
3. Fix tối thiểu + test; review nhanh qua az-reviewer.
4. Deploy qua human-gate; ghi task sửa triệt để sau.

## Đầu ra
Nhánh hotfix + report.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
