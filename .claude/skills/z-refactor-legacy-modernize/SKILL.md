---
name: z-refactor-legacy-modernize
description: "Hiện đại hóa code legacy từng bước."
---

# z-refactor-legacy-modernize

Thuộc agent: `az-refactor`

## Mục đích
Hiện đại hóa code legacy từng bước.

## Các bước
1. Dùng strangler pattern: thay từng module, cũ và mới chạy song song.
2. Mỗi bước có test và có thể dừng giữa chừng mà hệ thống vẫn chạy.
3. Không viết lại toàn bộ một lần (big-bang).

## Đầu ra
Kế hoạch từng bước + code bước hiện tại.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
