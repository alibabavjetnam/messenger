---
name: z-analyst-requirement-elicitation
description: "Làm rõ ý tưởng mơ hồ bằng câu hỏi và giả định có ghi chép."
---

# z-analyst-requirement-elicitation

Thuộc agent: `az-analyst`

## Mục đích
Làm rõ ý tưởng mơ hồ bằng câu hỏi và giả định có ghi chép.

## Các bước
1. Xác định: người dùng là ai, vấn đề cần giải, chức năng chính, dữ liệu, nền tảng, ràng buộc (thời gian, chi phí, công nghệ).
2. Ghi các giả định hợp lý cho chỗ thiếu.
3. Gom tối đa 5 câu hỏi quan trọng nhất, trả về saz-orchestrator để hỏi người dùng.

## Đầu ra
Phần 'Bối cảnh & giả định' trong `.az/spec.md` + danh sách câu hỏi.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
