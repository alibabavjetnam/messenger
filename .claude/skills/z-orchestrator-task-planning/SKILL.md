---
name: z-orchestrator-task-planning
description: "Chia yêu cầu thành các task nhỏ, mỗi task một agent, có thứ tự và tiêu chí hoàn thành."
---

# z-orchestrator-task-planning

Thuộc agent: `saz-orchestrator`

## Mục đích
Chia yêu cầu thành các task nhỏ, mỗi task một agent, có thứ tự và tiêu chí hoàn thành.

## Các bước
1. Đọc intake, spec và (nếu có) codebase-map.
2. Chia task sao cho mỗi task do đúng một agent làm và kiểm chứng được.
3. Xác định phụ thuộc giữa task; đánh dấu task chạy song song được (không đụng cùng file).
4. Gắn tiêu chí hoàn thành cho từng task.

## Đầu ra
`.az/tasks.md`: bảng ID | Task | Agent | Phụ thuộc | Trạng thái | Tiêu chí xong.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
