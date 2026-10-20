---
name: z-tester-test-plan
description: "Lập kế hoạch test từ acceptance criteria."
---

# z-tester-test-plan

Thuộc agent: `az-tester`

## Mục đích
Lập kế hoạch test từ acceptance criteria.

## Các bước
1. Ánh xạ mỗi acceptance criterion thành test case.
2. Chọn loại test: unit / integration / e2e.
3. Xác định dữ liệu test và phụ thuộc cần mock.

## Đầu ra
`.az/test-plan.md`.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
