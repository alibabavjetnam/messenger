---
name: z-reviewer-diff-review
description: "Đọc diff độc lập."
---

# z-reviewer-diff-review

Thuộc agent: `az-reviewer`

## Mục đích
Đọc diff độc lập.

## Các bước
1. `git diff` so với nhánh gốc; đọc toàn bộ thay đổi.
2. Không sửa code; chỉ ghi nhận xét kèm file:dòng.
3. Phân loại BLOCKER / MAJOR / MINOR / NIT.

## Đầu ra
Danh sách nhận xét trong report.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
