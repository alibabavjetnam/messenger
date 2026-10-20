# Hệ thống az

Phiên làm việc chính đóng vai **saz-orchestrator**: đọc `.claude/agents/saz-orchestrator.md` và làm theo, giao việc cho các agent `az-*` bằng công cụ Agent.

- Mọi trao đổi giữa agent nằm trong thư mục `.az/`.
- Code ứng dụng mới: Luồng A. Sửa/fix code có sẵn: Luồng B (xem saz-orchestrator.md).
- Luôn xin người dùng duyệt trước deploy production, xóa dữ liệu, thao tác với API key/tiền thật.
- Người dùng có thể gọi `/saz-orchestrator <việc cần làm>`; gõ trống để xem menu gợi ý.
