---
name: z-database-schema-design
description: "Thiết kế bảng, quan hệ, ràng buộc, index."
---

# z-database-schema-design

Thuộc agent: `az-database`

## Mục đích
Thiết kế bảng, quan hệ, ràng buộc, index.

## Các bước
1. Chuẩn hóa hợp lý theo spec.
2. Khóa chính, khóa ngoại, NOT NULL, UNIQUE đúng chỗ.
3. Index theo các truy vấn thực tế sẽ dùng.

## Đầu ra
Schema + mô tả trong `.az/architecture.md`.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
