---
name: z-performance-caching
description: "Thiết kế cache."
---

# z-performance-caching

Thuộc agent: `az-performance`

## Mục đích
Thiết kế cache.

## Các bước
1. Xác định dữ liệu đáng cache và thời gian sống (TTL).
2. Thiết kế cách xóa cache khi dữ liệu đổi.
3. Không cache dữ liệu riêng của người dùng sai phạm vi.

## Đầu ra
Thiết kế cache + số đo sau khi áp dụng.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
