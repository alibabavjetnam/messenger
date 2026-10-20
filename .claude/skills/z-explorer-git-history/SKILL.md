---
name: z-explorer-git-history
description: "Đọc lịch sử git để hiểu vì sao code như hiện tại và tìm commit gây lỗi."
---

# z-explorer-git-history

Thuộc agent: `az-explorer`

## Mục đích
Đọc lịch sử git để hiểu vì sao code như hiện tại và tìm commit gây lỗi.

## Các bước
1. `git log --follow` cho file liên quan; `git blame` cho các dòng nghi vấn.
2. Tìm commit gần nhất đụng vùng lỗi và lý do commit.
3. Nếu lỗi mới xuất hiện và có test tái hiện, dùng `git bisect` để tìm commit gây lỗi.

## Đầu ra
Ghi chú lịch sử trong report.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
