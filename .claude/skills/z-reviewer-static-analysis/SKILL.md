---
name: z-reviewer-static-analysis
description: "Chạy công cụ kiểm tra tĩnh."
---

# z-reviewer-static-analysis

Thuộc agent: `az-reviewer`

## Mục đích
Chạy công cụ kiểm tra tĩnh.

## Các bước
1. Chạy lint, type check, format check của dự án.
2. Dán output thật vào report.

## Đầu ra
Output công cụ trong report.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
