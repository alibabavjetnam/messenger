---
name: z-debugger-root-cause
description: "Tìm nguyên nhân gốc, không chỉ triệu chứng."
---

# z-debugger-root-cause

Thuộc agent: `az-debugger`

## Mục đích
Tìm nguyên nhân gốc, không chỉ triệu chứng.

## Các bước
1. Đặt giả thuyết, kiểm chứng từng cái.
2. Hỏi 'tại sao' liên tiếp đến khi tới nguyên nhân gốc.
3. Lỗi mới xuất hiện thì dùng z-explorer-git-history / git bisect.
4. Ghi rõ nguyên nhân gốc bằng 1–3 câu.

## Đầu ra
Mục 'Nguyên nhân gốc' trong report.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
