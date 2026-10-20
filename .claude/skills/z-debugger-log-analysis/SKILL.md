---
name: z-debugger-log-analysis
description: "Đọc log và stack trace."
---

# z-debugger-log-analysis

Thuộc agent: `az-debugger`

## Mục đích
Đọc log và stack trace.

## Các bước
1. Thu thập log/stack trace liên quan.
2. Tìm dòng đầu tiên trong code của dự án (không phải thư viện) trong stack trace.
3. Thêm log tạm nếu cần; nhớ gỡ trước khi xong.

## Đầu ra
Phân tích log trong report.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
