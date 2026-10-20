---
name: z-security-input-validation
description: "Kiểm tra lọc dữ liệu đầu vào."
---

# z-security-input-validation

Thuộc agent: `az-security`

## Mục đích
Kiểm tra lọc dữ liệu đầu vào.

## Các bước
1. Liệt kê mọi nguồn input: form, query, header, file, webhook.
2. Dùng whitelist; truy vấn DB có tham số; encode output.
3. Giới hạn kích thước và kiểu file upload.

## Đầu ra
Danh sách điểm input chưa an toàn.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
