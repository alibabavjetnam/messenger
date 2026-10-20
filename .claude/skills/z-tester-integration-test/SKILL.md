---
name: z-tester-integration-test
description: "Kiểm tra các phần ghép với nhau."
---

# z-tester-integration-test

Thuộc agent: `az-tester`

## Mục đích
Kiểm tra các phần ghép với nhau.

## Các bước
1. Dùng DB test hoặc container riêng.
2. Gọi API nội bộ thật, mock dịch vụ bên ngoài.
3. Dọn dữ liệu sau mỗi test.

## Đầu ra
File test + output.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
