---
name: z-debugger-minimal-fix
description: "Sửa lỗi với thay đổi nhỏ nhất."
---

# z-debugger-minimal-fix

Thuộc agent: `az-debugger`

## Mục đích
Sửa lỗi với thay đổi nhỏ nhất.

## Các bước
1. Sửa đúng nguyên nhân gốc.
2. Không refactor hay sửa thứ khác kèm theo.
3. Giữ convention của dự án.
4. Chạy test tái hiện: phải chuyển sang PASS.

## Đầu ra
Bản sửa + diff trong report.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
