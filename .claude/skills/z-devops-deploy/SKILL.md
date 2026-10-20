---
name: z-devops-deploy
description: "Triển khai."
---

# z-devops-deploy

Thuộc agent: `az-devops`

## Mục đích
Triển khai.

## Các bước
1. Checklist trước deploy: test xanh, review APPROVE, có kế hoạch rollback.
2. Qua human-gate với production.
3. Smoke test sau deploy.

## Đầu ra
Report deploy.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
