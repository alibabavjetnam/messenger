---
name: z-backend-background-jobs
description: "Tác vụ nền và lịch chạy định kỳ."
---

# z-backend-background-jobs

Thuộc agent: `az-backend`

## Mục đích
Tác vụ nền và lịch chạy định kỳ.

## Các bước
1. Thiết kế idempotent (chạy lại không gây sai).
2. Khóa chống chạy chồng.
3. Log bắt đầu/kết thúc/lỗi; retry khi lỗi tạm thời.

## Đầu ra
Job + test.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
