---
name: z-tester-e2e-test
description: "Kiểm tra luồng người dùng đầu–cuối."
---

# z-tester-e2e-test

Thuộc agent: `az-tester`

## Mục đích
Kiểm tra luồng người dùng đầu–cuối.

## Các bước
1. Chọn luồng chính theo user story.
2. Dùng công cụ dự án đang dùng (Playwright, Cypress…).
3. Dùng selector ổn định (data-testid).

## Đầu ra
Kịch bản e2e + output.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
