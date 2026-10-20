---
name: z-tester-coverage-report
description: "Báo cáo độ phủ test."
---

# z-tester-coverage-report

Thuộc agent: `az-tester`

## Mục đích
Báo cáo độ phủ test.

## Các bước
1. Chạy công cụ coverage của dự án.
2. Chỉ ra vùng quan trọng chưa được phủ.
3. Dán số liệu thật vào report.

## Đầu ra
Report coverage.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
