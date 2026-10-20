---
name: z-performance-bottleneck
description: "Tìm điểm nghẽn."
---

# z-performance-bottleneck

Thuộc agent: `az-performance`

## Mục đích
Tìm điểm nghẽn.

## Các bước
1. Xếp hạng hotspot từ kết quả profiling.
2. Phân loại: DB / IO / CPU / mạng / gọi dịch vụ ngoài.
3. Đề xuất cách xử lý cho top 3.

## Đầu ra
Danh sách điểm nghẽn + đề xuất.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
