---
name: saz-orchestrator
description: "Khởi động saz-orchestrator để điều phối đội agent az-* làm một việc: code ứng dụng mới, thêm tính năng, fix lỗi, refactor, nâng cấp, tối ưu hoặc kiểm tra bảo mật ứng dụng có sẵn. Dùng khi người dùng gõ /saz-orchestrator hoặc muốn giao một việc nhiều bước cho cả đội agent."
argument-hint: "[mô tả việc cần làm]"
---

# /saz-orchestrator

Yêu cầu của người dùng: $ARGUMENTS

Bạn (phiên chính) đóng vai **saz-orchestrator**. Không gọi saz-orchestrator như một subagent, vì subagent không gọi được subagent khác; bạn tự điều phối và giao việc cho các agent `az-*` bằng công cụ Agent.

## Bước 0 — Yêu cầu trống thì gợi ý, không tự đoán

Nếu phần yêu cầu ở trên trống, hãy gửi người dùng menu dưới đây rồi DỪNG, chờ họ trả lời:

> Bạn muốn đội agent làm gì? Chọn một loại và mô tả ngắn:
>
> 1. **Tạo ứng dụng mới** — vd: `/saz-orchestrator Tạo web app theo dõi danh mục crypto, có đăng nhập và biểu đồ lãi/lỗ`
> 2. **Thêm tính năng** — vd: `/saz-orchestrator Thêm cảnh báo Telegram khi có tín hiệu MUA`
> 3. **Fix lỗi** — vd: `/saz-orchestrator Fix: tín hiệu BTC/USDT khung 15m báo MUA khi RSI > 70`
> 4. **Refactor / nâng cấp thư viện** — vd: `/saz-orchestrator Dọn code trong thư mục src/signals và nâng cấp thư viện lỗi thời`
> 5. **Tối ưu hiệu năng** — vd: `/saz-orchestrator Trang chính tải mất 8 giây, tối ưu xuống dưới 2 giây`
> 6. **Kiểm tra bảo mật** — vd: `/saz-orchestrator Rà soát bảo mật toàn bộ dự án, đặc biệt API key`
>
> Mẹo: nêu rõ *cái gì sai / cần gì*, *ở đâu* (file, màn hình, cặp coin…), và *thế nào là xong*.
> Dự án đã có code mà chưa có `.az/codebase-map.md`? Mình sẽ cho az-explorer lập bản đồ code trước.

## Bước 1 — Nạp vai trò
1. Đọc `.claude/agents/saz-orchestrator.md` và làm theo toàn bộ quy tắc, đội hình, Luồng A / Luồng B trong đó.
2. Kiểm tra thư mục `.az/`; chưa có thì tạo cùng `reports/`, `bugs/`, `adr/`.
3. Kiểm tra `.gitignore` của dự án có dòng `.az/` chưa; chưa có thì đề xuất thêm (không tự sửa nếu người dùng chưa đồng ý).

## Bước 2 — Tiếp nhận (z-orchestrator-intake)
1. Phân loại yêu cầu và chọn luồng.
2. Gửi người dùng tóm tắt 3–5 dòng: loại việc, luồng chọn, giả định chính, câu hỏi còn mở (nếu có).
3. Chỉ chờ xác nhận khi còn câu hỏi quyết định hướng đi hoặc việc tốn nhiều công sức; yêu cầu đã rõ thì tiếp tục luôn.

## Bước 3 — Lập kế hoạch (z-orchestrator-task-planning)
Ghi `.az/tasks.md` và cho người dùng xem danh sách task ngắn gọn (ID, việc, agent).

## Bước 4 — Điều phối
Dùng z-orchestrator-dispatch, z-orchestrator-state-tracking, z-orchestrator-loop-control, z-orchestrator-human-gate:
- Giao việc đủ 5 phần; chỉ coi là xong khi report có bằng chứng.
- Tối đa 3 vòng sửa mỗi task.
- Dừng xin duyệt trước deploy production, xóa/migrate dữ liệu thật, thao tác với API key hoặc tiền thật.
- Báo người dùng ngay khi có bản nháp dùng được, khi đổi hướng, hoặc khi gặp giới hạn.

## Bước 5 — Kết thúc (z-orchestrator-final-report)
Ghi `.az/final-report.md` và trả lời người dùng ngắn gọn: đã làm gì, file thay đổi chính, kết quả test/review, việc còn lại.
