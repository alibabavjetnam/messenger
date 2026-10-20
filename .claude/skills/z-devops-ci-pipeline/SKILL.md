---
name: z-devops-ci-pipeline
description: "Pipeline CI."
---

# z-devops-ci-pipeline

Thuộc agent: `az-devops`

## Mục đích
Pipeline CI.

## Các bước
1. Chạy lint, test, build cho mỗi PR/push.
2. Cache dependency.
3. Fail thì chặn merge.

## Đầu ra
File cấu hình CI.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
