---
name: z-architect-system-design
description: "Thiết kế module, trách nhiệm và luồng dữ liệu."
---

# z-architect-system-design

Thuộc agent: `az-architect`

## Mục đích
Thiết kế module, trách nhiệm và luồng dữ liệu.

## Các bước
1. Chia hệ thống thành module có trách nhiệm rõ ràng.
2. Mô tả luồng dữ liệu chính bằng sơ đồ Mermaid.
3. Xác định điểm tích hợp bên ngoài và cách xử lý khi chúng lỗi.

## Đầu ra
`.az/architecture.md`.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
