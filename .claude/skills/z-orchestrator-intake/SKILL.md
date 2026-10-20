---
name: z-orchestrator-intake
description: "Nhận và phân loại yêu cầu: app mới, thêm tính năng, fix bug, refactor/nâng cấp, hiệu năng, bảo mật. Dùng đầu tiên với mọi yêu cầu mới."
---

# z-orchestrator-intake

Thuộc agent: `saz-orchestrator`

## Mục đích
Nhận và phân loại yêu cầu: app mới, thêm tính năng, fix bug, refactor/nâng cấp, hiệu năng, bảo mật. Dùng đầu tiên với mọi yêu cầu mới.

## Các bước
1. Đọc kỹ yêu cầu của người dùng.
2. Kiểm tra repo đã có code chưa (Glob các file như package.json, pyproject.toml, src/).
3. Phân loại: NEW_APP / NEW_FEATURE / BUG_FIX / REFACTOR / UPGRADE / PERF / SECURITY.
4. Liệt kê thông tin còn thiếu; nếu thiếu thứ quyết định hướng đi thì hỏi người dùng (tối đa 3 câu).
5. Chọn Luồng A (app mới) hoặc Luồng B (code có sẵn).

## Đầu ra
`.az/intake.md`: loại yêu cầu, luồng chọn, giả định, câu hỏi mở.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
