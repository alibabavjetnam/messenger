---
name: z-architect-tech-stack-selection
description: "Chọn ngôn ngữ, framework, hạ tầng cho ứng dụng mới."
---

# z-architect-tech-stack-selection

Thuộc agent: `az-architect`

## Mục đích
Chọn ngôn ngữ, framework, hạ tầng cho ứng dụng mới.

## Các bước
1. Đọc spec và ràng buộc của người dùng.
2. So sánh 2–3 lựa chọn theo: phù hợp yêu cầu, độ phổ biến, chi phí, khả năng bảo trì.
3. Chọn một và ghi ADR.

## Đầu ra
ADR trong `.az/adr/`.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
