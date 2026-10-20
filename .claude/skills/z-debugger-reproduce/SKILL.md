---
name: z-debugger-reproduce
description: "Tái hiện lỗi một cách ổn định."
---

# z-debugger-reproduce

Thuộc agent: `az-debugger`

## Mục đích
Tái hiện lỗi một cách ổn định.

## Các bước
1. Đọc `.az/bugs/BUG-<n>.md`.
2. Dựng lại điều kiện: dữ liệu, cấu hình, bước thao tác.
3. Ưu tiên viết một test tự động đang FAIL thể hiện lỗi.
4. Không tái hiện được thì báo lại thông tin còn thiếu.

## Đầu ra
Test tái hiện (fail) + ghi bước trong report.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
