---
name: z-tester-edge-case
description: "Sinh và kiểm tra trường hợp biên."
---

# z-tester-edge-case

Thuộc agent: `az-tester`

## Mục đích
Sinh và kiểm tra trường hợp biên.

## Các bước
1. Thử: rỗng, null, giá trị cực lớn/nhỏ, số âm, unicode, trùng lặp, sai định dạng.
2. Thử: đồng thời, timeout, mất kết nối dịch vụ ngoài.
3. Ghi các case làm hỏng hệ thống thành bug.

## Đầu ra
Test biên + danh sách lỗi phát hiện.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
