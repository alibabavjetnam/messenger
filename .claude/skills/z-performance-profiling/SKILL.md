---
name: z-performance-profiling
description: "Đo hiệu năng hiện tại."
---

# z-performance-profiling

Thuộc agent: `az-performance`

## Mục đích
Đo hiệu năng hiện tại.

## Các bước
1. Chọn kịch bản sử dụng chính.
2. Đo thời gian phản hồi, CPU, bộ nhớ bằng công cụ phù hợp.
3. Ghi baseline bằng số liệu thật.

## Đầu ra
Số đo baseline.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
