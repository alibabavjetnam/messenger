---
name: z-architect-adr
description: "Ghi lại quyết định kiến trúc."
---

# z-architect-adr

Thuộc agent: `az-architect`

## Mục đích
Ghi lại quyết định kiến trúc.

## Các bước
1. Dùng mẫu: Bối cảnh, Quyết định, Các lựa chọn đã cân nhắc, Hệ quả.
2. Đánh số tăng dần, tên file `NNN-tieu-de.md`.
3. Không sửa ADR cũ; quyết định mới thay thế thì tạo ADR mới và tham chiếu.

## Đầu ra
`.az/adr/NNN-*.md`.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
