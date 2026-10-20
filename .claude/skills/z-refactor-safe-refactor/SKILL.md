---
name: z-refactor-safe-refactor
description: "Refactor an toàn có test bảo vệ."
---

# z-refactor-safe-refactor

Thuộc agent: `az-refactor`

## Mục đích
Refactor an toàn có test bảo vệ.

## Các bước
1. Kiểm tra vùng sửa đã có test chưa; thiếu thì yêu cầu z-tester-characterization-test trước.
2. Thay đổi từng bước nhỏ; chạy test sau mỗi bước.
3. Không đổi hành vi bên ngoài.

## Đầu ra
Code refactor + output test trước/sau.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
