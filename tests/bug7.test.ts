/**
 * Test hồi quy BUG-7 (.az/bugs/BUG-7.md): vạch ngưỡng RSI trên biểu đồ theo tham số rsiLow/rsiHigh.
 * ECharts, DOM và ResizeObserver được giả lập; chỉ kiểm tra option truyền cho setOption.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildSeries } from '../src/core/indicators';
import { HOUR, genCandles, prng } from './fixtures';

let captured: Record<string, unknown> | null = null;
const g = globalThis as Record<string, unknown>;
g.echarts = { init: () => ({ setOption: (o: Record<string, unknown>) => { captured = o; }, resize: () => {}, dispose: () => {} }) };
g.ResizeObserver = class { observe() {} disconnect() {} };
g.document = { documentElement: {} };
g.getComputedStyle = () => ({ getPropertyValue: () => '#000' });

const { PriceChart } = await import('../src/ui/chart');

describe('BUG-7: đường ngưỡng RSI', () => {
  test('markLine của RSI dùng rsiLow/rsiHigh', () => {
    const el = { innerHTML: '', clientWidth: 1000 } as unknown as HTMLElement;
    const chart = new PriceChart(el);
    const series = buildSeries(genCandles(prng(1), 60, Date.UTC(2024, 0, 1), HOUR, 100, 0));
    chart.render({
      series, intervalMs: HOUR, title: 't', type: 'candle', marks: [], channels: [], trades: [], resetZoom: true,
      rsiLow: 25, rsiHigh: 80,
    });
    assert.ok(captured);
    const rsi = (captured.series as { name: string; markLine: { data: { yAxis: number }[] } }[]).find((s) => s.name === 'RSI 14')!;
    assert.deepEqual(rsi.markLine.data.map((d) => d.yAxis), [25, 80]);
  });
});
