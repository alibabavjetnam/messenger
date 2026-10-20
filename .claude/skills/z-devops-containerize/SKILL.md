---
name: z-devops-containerize
description: "Đóng gói Docker."
---

# z-devops-containerize

Thuộc agent: `az-devops`

## Mục đích
Đóng gói Docker.

## Các bước
1. Dockerfile multi-stage, chạy bằng user không phải root.
2. `.dockerignore` loại file thừa và secret.
3. Build và chạy thử container.

## Đầu ra
Dockerfile + output build/chạy.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
