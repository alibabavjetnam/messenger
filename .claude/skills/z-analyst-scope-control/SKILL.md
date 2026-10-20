---
name: z-analyst-scope-control
description: "Kiểm soát phạm vi và phát hiện yêu cầu mâu thuẫn."
---

# z-analyst-scope-control

Thuộc agent: `az-analyst`

## Mục đích
Kiểm soát phạm vi và phát hiện yêu cầu mâu thuẫn.

## Các bước
1. Tách MVP (Must) khỏi phần làm sau.
2. Tìm yêu cầu mâu thuẫn hoặc trùng lặp, báo về orchestrator.
3. Ghi rõ những gì nằm ngoài phạm vi.

## Đầu ra
Mục 'Phạm vi / Ngoài phạm vi' trong `.az/spec.md`.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
