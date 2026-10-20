---
name: z-backend-business-logic
description: "Viết logic nghiệp vụ cốt lõi."
---

# z-backend-business-logic

Thuộc agent: `az-backend`

## Mục đích
Viết logic nghiệp vụ cốt lõi.

## Các bước
1. Tách logic khỏi tầng HTTP và DB.
2. Viết hàm thuần (không side-effect) khi có thể để dễ test.
3. Ghi rõ công thức/quy tắc nghiệp vụ trong comment hoặc tài liệu.
4. Unit test đầy đủ, kể cả trường hợp biên.

## Đầu ra
Module logic + unit test.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
