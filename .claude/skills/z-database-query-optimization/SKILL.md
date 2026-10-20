---
name: z-database-query-optimization
description: "Tối ưu truy vấn chậm."
---

# z-database-query-optimization

Thuộc agent: `az-database`

## Mục đích
Tối ưu truy vấn chậm.

## Các bước
1. Chạy EXPLAIN/EXPLAIN ANALYZE.
2. Thêm index, viết lại truy vấn, loại N+1.
3. Đo thời gian trước/sau.

## Đầu ra
Report có số đo trước/sau.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
