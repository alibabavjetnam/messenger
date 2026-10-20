---
name: z-analyst-bug-triage
description: "Chuẩn hóa báo lỗi thô thành báo cáo lỗi đầy đủ."
---

# z-analyst-bug-triage

Thuộc agent: `az-analyst`

## Mục đích
Chuẩn hóa báo lỗi thô thành báo cáo lỗi đầy đủ.

## Các bước
1. Thu thập: môi trường, phiên bản, bước tái hiện, kết quả mong đợi, kết quả thực tế, log/ảnh chụp.
2. Đánh mức độ: S1 (sập/mất dữ liệu/mất tiền) đến S4 (thẩm mỹ).
3. Ghi tiêu chí coi là đã sửa xong.
4. Thiếu thông tin tái hiện thì gửi câu hỏi qua orchestrator.

## Đầu ra
`.az/bugs/BUG-<n>.md`.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
