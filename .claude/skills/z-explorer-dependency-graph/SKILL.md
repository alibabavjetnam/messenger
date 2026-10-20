---
name: z-explorer-dependency-graph
description: "Vẽ quan hệ phụ thuộc giữa các module và thư viện ngoài."
---

# z-explorer-dependency-graph

Thuộc agent: `az-explorer`

## Mục đích
Vẽ quan hệ phụ thuộc giữa các module và thư viện ngoài.

## Các bước
1. Grep import/require để lập đồ thị phụ thuộc nội bộ.
2. Đánh dấu module trung tâm (nhiều nơi phụ thuộc) là vùng rủi ro cao.
3. Liệt kê thư viện ngoài quan trọng và chỗ dùng.

## Đầu ra
`.az/codebase-map.md` mục 'Phụ thuộc' (có thể kèm sơ đồ Mermaid).

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
