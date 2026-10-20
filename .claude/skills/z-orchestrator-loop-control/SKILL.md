---
name: z-orchestrator-loop-control
description: "Giới hạn vòng lặp sửa–test–review để tránh chạy vô tận."
---

# z-orchestrator-loop-control

Thuộc agent: `saz-orchestrator`

## Mục đích
Giới hạn vòng lặp sửa–test–review để tránh chạy vô tận.

## Các bước
1. Đếm số vòng cho mỗi task (code → test/review → sửa).
2. Mỗi vòng ghi lý do thất bại vào tasks.md.
3. Nếu cùng một lỗi lặp lại 2 lần, đổi cách tiếp cận (gọi az-debugger hoặc az-architect).
4. Quá 3 vòng: dừng, tóm tắt tình hình và hỏi người dùng.

## Đầu ra
Ghi chú vòng lặp trong `.az/tasks.md`; câu hỏi cho người dùng khi vượt giới hạn.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
