---
name: z-orchestrator-state-tracking
description: "Theo dõi tiến độ và xác minh kết quả từng agent."
---

# z-orchestrator-state-tracking

Thuộc agent: `saz-orchestrator`

## Mục đích
Theo dõi tiến độ và xác minh kết quả từng agent.

## Các bước
1. Sau mỗi agent trả về, đọc report của nó.
2. Kiểm tra bằng chứng: output test, lint, build. Không có bằng chứng thì chưa coi là xong.
3. Cập nhật trạng thái trong `.az/tasks.md`: todo / doing / done / blocked.
4. Mở khóa task kế tiếp khi phụ thuộc đã xong.

## Đầu ra
`.az/tasks.md` luôn phản ánh đúng thực tế.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
