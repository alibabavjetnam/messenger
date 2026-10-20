---
name: z-architect-change-design
description: "Thiết kế thay đổi trong codebase có sẵn."
---

# z-architect-change-design

Thuộc agent: `az-architect`

## Mục đích
Thiết kế thay đổi trong codebase có sẵn.

## Các bước
1. Đọc codebase-map, conventions và phân tích ảnh hưởng.
2. Chọn phương án thay đổi nhỏ nhất đạt mục tiêu.
3. Giữ tương thích ngược; nếu không thể, ghi kế hoạch chuyển đổi.
4. Đề xuất feature flag cho thay đổi rủi ro cao.

## Đầu ra
Mục thiết kế thay đổi trong `.az/architecture.md` + ADR.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
