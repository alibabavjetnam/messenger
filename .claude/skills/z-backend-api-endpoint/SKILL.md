---
name: z-backend-api-endpoint
description: "Viết endpoint đúng API contract."
---

# z-backend-api-endpoint

Thuộc agent: `az-backend`

## Mục đích
Viết endpoint đúng API contract.

## Các bước
1. Validate toàn bộ input.
2. Trả mã trạng thái và định dạng lỗi đúng contract.
3. Viết test cho trường hợp thành công và lỗi.

## Đầu ra
Endpoint + test.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
