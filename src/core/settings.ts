import { DEFAULT_SETTINGS, type Settings } from './types';

export interface SettingField {
  key: keyof Settings;
  label: string;
  step: number;
  min: number;
  max: number;
}

/** Các tham số chỉnh được trên giao diện. step = 1 nghĩa là tham số nguyên (dùng làm số nến / chỉ số mảng). */
export const SETTING_FIELDS: SettingField[] = [
  { key: 'rr', label: 'Tỉ lệ chốt lời (R:R)', step: 0.1, min: 0.5, max: 10 },
  { key: 'lookbackWith', label: 'Số nến quét, kênh 1', step: 1, min: 10, max: 300 },
  { key: 'lookbackCounter', label: 'Số nến quét, kênh 2', step: 1, min: 20, max: 400 },
  { key: 'minGap', label: 'Khoảng cách tối thiểu đáy/đỉnh 1 và 2 (nến)', step: 1, min: 2, max: 100 },
  { key: 'pivotLeft', label: 'Độ rộng đáy/đỉnh, bên trái', step: 1, min: 1, max: 20 },
  { key: 'pivotRight', label: 'Độ rộng đáy/đỉnh, bên phải', step: 1, min: 1, max: 20 },
  { key: 'rsiLow', label: 'Ngưỡng RSI quá bán', step: 1, min: 5, max: 50 },
  { key: 'rsiHigh', label: 'Ngưỡng RSI quá mua', step: 1, min: 50, max: 95 },
  { key: 'trendMinScore', label: 'Điểm tối thiểu công nhận xu hướng (trên 6)', step: 1, min: 2, max: 6 },
];

/** Làm tròn tham số nguyên rồi kẹp trong [min, max]. Trả null nếu không phải số (NaN). */
export function clampSetting(f: SettingField, x: number): number | null {
  const v = Math.min(f.max, Math.max(f.min, f.step === 1 ? Math.round(x) : x));
  return Number.isFinite(v) ? v : null;
}

/** Đọc tham số đã lưu (localStorage): khóa thiếu hoặc sai kiểu dùng mặc định, giá trị số được chuẩn hóa như trên form. */
export function sanitizeSettings(raw: unknown): Settings {
  const src = raw !== null && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const out: Settings = { ...DEFAULT_SETTINGS };
  for (const f of SETTING_FIELDS) {
    const x = src[f.key];
    const v = typeof x === 'number' ? clampSetting(f, x) : null;
    if (v !== null) out[f.key] = v;
  }
  return out;
}
