# 4v2 · Bảng tín hiệu 2 kênh

Công cụ phân tích kỹ thuật cho cặp giao dịch trên Binance, viết bằng TypeScript. Tự tải dữ liệu nến khung giao dịch (1m → 4h) và nến ngày, cập nhật realtime qua WebSocket, đánh giá 2 kênh giao dịch và backtest tỉ lệ thắng ngay trên dữ liệu đang xem. Chạy tốt trên trình duyệt máy tính và điện thoại.

> Công cụ hỗ trợ phân tích, không phải lời khuyên đầu tư.

## Chạy nhanh

| Cách | Lệnh |
| --- | --- |
| Không cần cài gì | Mở `standalone/4v2.html` bằng trình duyệt |
| Phát triển | `npm install` rồi `npm run dev` |
| Build web tĩnh | `npm run build` (kết quả ở `dist/`) |
| Tạo lại bản 1 file | `npm run build:standalone` |

## Đưa lên GitHub

```bash
cd 4v2
git init && git add . && git commit -m "4v2: bảng tín hiệu 2 kênh"
git branch -M main
git remote add origin https://github.com/<tên-bạn>/4v2.git   # tạo repo trống tên 4v2 trước
git push -u origin main
```

Muốn có trang web chạy online: vào **Settings → Pages → Build and deployment → Source: GitHub Actions**. Workflow `.github/workflows/deploy.yml` sẽ tự build và xuất bản tại `https://<tên-bạn>.github.io/4v2/` mỗi lần push lên `main`.

## Cấu trúc

```
src/
  core/types.ts        Kiểu dữ liệu, tham số mặc định
  core/indicators.ts   EMA, SMA, RSI (Wilder), Bollinger, hồi quy tuyến tính, pivot
  core/trend.ts        Chấm điểm xu hướng 6 điểm
  core/channels.ts     Kênh 1 (cùng xu hướng) và Kênh 2 (ngược xu hướng)
  core/backtest.ts     Backtest không nhìn trước tương lai
  data/binance.ts      Tải REST nhiều máy chủ dự phòng, đọc dữ liệu dán tay, WebSocket realtime
  ui/chart.ts          Biểu đồ ECharts (giá, MA, BB, kênh hồi quy, khối lượng, RSI, điểm N/M, đáy/đỉnh 1-2)
  main.ts              Điều phối giao diện
standalone/4v2.html    Bản đóng gói 1 file
```

## Nguồn dữ liệu

1. Tự động: REST `/api/v3/klines` (1000 nến), thử lần lượt `api.binance.com`, `data-api.binance.vision`, `api1-3.binance.com`. Realtime qua `stream.binance.com`, dự phòng `data-stream.binance.vision`, tự kết nối lại.
2. Thủ công (khi có nguồn khác hoặc tải tự động lỗi): mục **Nhập dữ liệu thủ công** nhận JSON klines của Binance hoặc CSV `time,open,high,low,close,volume`. Ô nến ngày có thể để trống, hệ thống sẽ gộp từ dữ liệu khung giao dịch.

## Xác định xu hướng (áp dụng cho cả D1 và khung giao dịch)

| Tiêu chí | Điểm | Tăng | Giảm |
| --- | --- | --- | --- |
| Cấu trúc đỉnh - đáy (pivot 3 nến) | 2 | HH + HL | LH + LL |
| Kênh giá 50 nến (hồi quy, R² ≥ 0.5) | 1 | dốc lên | dốc xuống |
| Trật tự MA | 1 | EMA20 > SMA50 > SMA200 | EMA20 < SMA50 < SMA200 |
| Vị trí giá | 1 | trên cả 3 MA | dưới cả 3 MA |
| Độ dốc SMA50 & SMA200 (10 nến) | 1 | cùng dốc lên | cùng dốc xuống |

Có xu hướng khi một phe đạt ≥ 4/6 điểm (chỉnh được), hơn phe kia ≥ 3 điểm và cấu trúc đỉnh - đáy không ngược chiều.

## Kênh 1, cùng xu hướng

1. D1 có xu hướng tăng hoặc giảm.
2. Khung giao dịch có xu hướng **cùng chiều** D1.
3. Giá đã chọc Bollinger Band (dải dưới khi D1 tăng, dải trên khi D1 giảm) rồi đóng cửa trở lại trong dải.
4. RSI đã chạm 30 (D1 tăng) hoặc 70 (D1 giảm) rồi quay lại theo hướng D1.
5. **Nến vào lệnh:** D1 tăng, N là nến có râu thấp nhất của nhịp điều chỉnh, giá hiện tại > đỉnh nến N-1. D1 giảm, M là nến có râu cao nhất, giá hiện tại < đáy nến M-1.

## Kênh 2, ngược xu hướng

1. D1 có xu hướng tăng hoặc giảm.
2. Khung giao dịch **không có xu hướng** hoặc **ngược chiều** D1.
3. Giá đã chọc Bollinger Band rồi đi vào trong (như kênh 1).
4. RSI chạm 30/70 rồi quay lại tạo đáy 1 (đỉnh 1). Sau đó giá tạo đáy 2 cao hơn đáy 1 (đỉnh 2 thấp hơn đỉnh 1), cách nhau tối thiểu 9 nến; giá không được phá đáy 1 (đỉnh 1) trong lúc chờ.
5. **Nến vào lệnh:** N là râu đáy 2, giá hiện tại > đỉnh nến N-1. Với đỉnh 2 là M, giá hiện tại < đáy nến M-1.

Logic lệnh bán được tính bằng cách lật giá (×−1) và RSI (100 − RSI) rồi dùng lại đúng logic lệnh mua, nên hai chiều luôn đối xứng.

## Backtest

- Xu hướng D1 tại mỗi nến chỉ dùng các nến ngày **đã đóng**; pivot chỉ dùng dữ liệu tới nến đang xét.
- Vào lệnh ở giá đóng cửa nến tín hiệu. Cắt lỗ tại râu nến N/M (kênh 2: râu đáy/đỉnh 2). Chốt lời = R:R × rủi ro (mặc định 1.5).
- Nến chạm cả cắt lỗ và chốt lời được tính là thua. Mỗi kênh giữ tối đa 1 lệnh, mỗi nến N/M chỉ vào lệnh 1 lần.
- Chưa tính phí giao dịch và trượt giá.

Mọi tham số (R:R, số nến quét, khoảng cách đáy/đỉnh, độ rộng pivot, ngưỡng RSI, điểm xu hướng) chỉnh được trong mục **Tham số** và được lưu trên trình duyệt.
