---
name: z-database-backup-restore
description: "Sao lưu và khôi phục dữ liệu."
---

# z-database-backup-restore

Thuộc agent: `az-database`

## Mục đích
Sao lưu và khôi phục dữ liệu.

## Các bước
1. Backup trước mọi migration/thay đổi lớn.
2. Thử restore để chắc chắn backup dùng được.
3. Thao tác với production phải qua human-gate.

## Đầu ra
Lệnh/script backup-restore + report.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
