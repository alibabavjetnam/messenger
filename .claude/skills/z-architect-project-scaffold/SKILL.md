---
name: z-architect-project-scaffold
description: "Dựng khung dự án mới chạy được ngay."
---

# z-architect-project-scaffold

Thuộc agent: `az-architect`

## Mục đích
Dựng khung dự án mới chạy được ngay.

## Các bước
1. Tạo cấu trúc thư mục theo architecture.md.
2. Cấu hình lint, format, test framework, `.gitignore`, `.env.example`.
3. Viết một endpoint/trang mẫu và một test mẫu; chạy cả hai pass.

## Đầu ra
Khung dự án + report có output chạy thử.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
