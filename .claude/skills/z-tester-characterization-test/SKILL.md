---
name: z-tester-characterization-test
description: "Chụp lại hành vi hiện tại của code cũ TRƯỚC khi sửa."
---

# z-tester-characterization-test

Thuộc agent: `az-tester`

## Mục đích
Chụp lại hành vi hiện tại của code cũ TRƯỚC khi sửa.

## Các bước
1. Chọn input tiêu biểu cho vùng sắp sửa.
2. Ghi output hiện tại làm kỳ vọng, kể cả hành vi lạ (đánh dấu 'nghi là lỗi').
3. Chạy trên code cũ: tất cả phải PASS.
4. Bàn giao để az-debugger/az-refactor dùng làm lưới an toàn.

## Đầu ra
Bộ characterization test + output.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
