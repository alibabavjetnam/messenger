---
name: z-orchestrator-human-gate
description: "Dừng xin người dùng duyệt trước các hành động không đảo ngược được."
---

# z-orchestrator-human-gate

Thuộc agent: `saz-orchestrator`

## Mục đích
Dừng xin người dùng duyệt trước các hành động không đảo ngược được.

## Các bước
1. Nhận diện hành động cần duyệt: deploy production, migration/xóa dữ liệu thật, đụng API key hoặc tiền thật, xóa file, force push.
2. Trình bày: làm gì, vì sao, rủi ro, cách rollback.
3. Chờ người dùng đồng ý rõ ràng; không suy diễn sự im lặng là đồng ý.
4. Ghi quyết định vào `.az/tasks.md`.

## Đầu ra
Quyết định duyệt/không duyệt được ghi lại.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
