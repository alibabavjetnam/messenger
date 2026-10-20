---
name: z-devops-rollback
description: "Quay về phiên bản trước."
---

# z-devops-rollback

Thuộc agent: `az-devops`

## Mục đích
Quay về phiên bản trước.

## Các bước
1. Viết sẵn lệnh rollback cụ thể trước mỗi deploy.
2. Gồm cả rollback migration nếu có.
3. Thử rollback ở staging.

## Đầu ra
Kế hoạch rollback.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
