---
name: z-performance-load-test
description: "Kiểm tra chịu tải."
---

# z-performance-load-test

Thuộc agent: `az-performance`

## Mục đích
Kiểm tra chịu tải.

## Các bước
1. Viết kịch bản bằng k6 / locust / công cụ dự án dùng.
2. Đặt ngưỡng chấp nhận (độ trễ, tỉ lệ lỗi).
3. Chỉ chạy vào môi trường test; production/API ngoài phải qua human-gate.

## Đầu ra
Kết quả load test.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
