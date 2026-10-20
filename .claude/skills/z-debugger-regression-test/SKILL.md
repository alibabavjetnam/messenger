---
name: z-debugger-regression-test
description: "Khóa lỗi bằng test để không tái phát."
---

# z-debugger-regression-test

Thuộc agent: `az-debugger`

## Mục đích
Khóa lỗi bằng test để không tái phát.

## Các bước
1. Giữ test tái hiện làm test hồi quy, đặt tên theo BUG id.
2. Chạy TOÀN BỘ test suite, so với baseline.
3. Dán output test vào report.

## Đầu ra
Test hồi quy + output.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
