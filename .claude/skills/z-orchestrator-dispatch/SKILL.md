---
name: z-orchestrator-dispatch
description: "Giao task cho đúng agent az-* kèm đủ ngữ cảnh."
---

# z-orchestrator-dispatch

Thuộc agent: `saz-orchestrator`

## Mục đích
Giao task cho đúng agent az-* kèm đủ ngữ cảnh.

## Các bước
1. Chọn agent theo bảng đội hình.
2. Soạn lời giao việc đủ 5 phần: mục tiêu, file/ngữ cảnh, acceptance criteria, đầu ra, đường dẫn report `.az/reports/<agent>-<task-id>.md`.
3. Giao song song các task độc lập; tuần tự các task phụ thuộc.
4. Không giao việc review/test cho agent đã viết chính phần code đó.

## Đầu ra
Task đã giao, trạng thái cập nhật trong `.az/tasks.md`.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
