---
name: z-explorer-codebase-mapping
description: "Lập bản đồ codebase có sẵn."
---

# z-explorer-codebase-mapping

Thuộc agent: `az-explorer`

## Mục đích
Lập bản đồ codebase có sẵn.

## Các bước
1. Liệt kê cây thư mục, bỏ qua node_modules, .git, dist, build, venv.
2. Xác định entry point (main, index, app, server…).
3. Mô tả ngắn từng module/thư mục chính và trách nhiệm của nó.

## Đầu ra
`.az/codebase-map.md` mục 'Cấu trúc'.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
