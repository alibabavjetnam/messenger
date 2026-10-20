---
name: z-frontend-state-management
description: "Quản lý trạng thái ứng dụng."
---

# z-frontend-state-management

Thuộc agent: `az-frontend`

## Mục đích
Quản lý trạng thái ứng dụng.

## Các bước
1. Dùng giải pháp dự án đang dùng; không thêm thư viện mới khi chưa có ADR.
2. Ưu tiên state cục bộ; chỉ đưa lên global khi nhiều nơi cần.
3. Một nguồn sự thật cho mỗi dữ liệu, không nhân bản.

## Đầu ra
Code state + ghi chú trong report.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
