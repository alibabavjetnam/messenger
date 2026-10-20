---
name: z-architect-api-contract
description: "Định nghĩa giao diện giữa frontend, backend và dịch vụ ngoài."
---

# z-architect-api-contract

Thuộc agent: `az-architect`

## Mục đích
Định nghĩa giao diện giữa frontend, backend và dịch vụ ngoài.

## Các bước
1. Liệt kê endpoint: method, path, request, response, mã lỗi.
2. Thống nhất định dạng lỗi và phân trang.
3. Ghi dạng bảng hoặc OpenAPI.

## Đầu ra
`.az/api-contract.md` (hoặc `openapi.yaml`).

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
