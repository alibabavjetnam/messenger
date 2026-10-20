---
name: z-database-migration
description: "Viết migration an toàn."
---

# z-database-migration

Thuộc agent: `az-database`

## Mục đích
Viết migration an toàn.

## Các bước
1. Mỗi thay đổi một migration, có cả up và down.
2. Thay đổi không mất dữ liệu: thêm cột nullable → backfill → thêm ràng buộc.
3. Chạy thử trên DB dev/bản sao; ghi output.
4. Migration trên DB thật phải qua human-gate.

## Đầu ra
File migration + report chạy thử.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
