---
name: z-analyst-acceptance-criteria
description: "Viết tiêu chí nghiệm thu kiểm chứng được cho từng story."
---

# z-analyst-acceptance-criteria

Thuộc agent: `az-analyst`

## Mục đích
Viết tiêu chí nghiệm thu kiểm chứng được cho từng story.

## Các bước
1. Dùng mẫu Given / When / Then.
2. Mỗi story có ít nhất 1 trường hợp thành công và 1 trường hợp lỗi.
3. Dùng giá trị đo được, tránh từ mơ hồ như 'nhanh', 'đẹp'.

## Đầu ra
Mục 'Acceptance criteria' trong `.az/spec.md`.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
