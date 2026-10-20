---
name: z-orchestrator-final-report
description: "Tổng kết khi toàn bộ task xong hoặc phải dừng."
---

# z-orchestrator-final-report

Thuộc agent: `saz-orchestrator`

## Mục đích
Tổng kết khi toàn bộ task xong hoặc phải dừng.

## Các bước
1. Tóm tắt đã làm gì so với yêu cầu ban đầu.
2. Liệt kê file thay đổi chính và kết quả test/review cuối.
3. Ghi rủi ro còn lại, việc chưa làm, bước tiếp theo đề xuất.

## Đầu ra
`.az/final-report.md` và một tóm tắt ngắn cho người dùng.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
