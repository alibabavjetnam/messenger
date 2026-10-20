---
name: z-explorer-impact-analysis
description: "Xác định thay đổi ở một chỗ sẽ ảnh hưởng những đâu."
---

# z-explorer-impact-analysis

Thuộc agent: `az-explorer`

## Mục đích
Xác định thay đổi ở một chỗ sẽ ảnh hưởng những đâu.

## Các bước
1. Grep mọi nơi gọi hàm/lớp/biến/endpoint sắp sửa.
2. Liệt kê file và tính năng bị ảnh hưởng.
3. Chỉ ra test nào đang phủ vùng đó, vùng nào chưa có test.
4. Đánh giá rủi ro: thấp / trung bình / cao.

## Đầu ra
Report phân tích ảnh hưởng trong `.az/reports/`.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
