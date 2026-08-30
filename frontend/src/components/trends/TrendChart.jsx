import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Tooltip,
  Filler
} from 'chart.js';
import { baselineTrendData, trendMetricInfo } from '../../data/baselineTrends';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Tooltip, Filler);

export default function TrendChart({ range = '24h', metric = 'aqi', height = '360px' }) {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const dataset = baselineTrendData[range];
  const info = trendMetricInfo[metric];
  const values = dataset[metric];

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
    const existingChart = ChartJS.getChart(canvasRef.current);
    if (existingChart) {
      existingChart.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: dataset.labels,
        datasets: [
          {
            label: info.label,
            data: values,
            borderColor: info.color,
            backgroundColor: info.bg || 'rgba(8,127,118,.08)',
            borderWidth: 2.8,
            pointRadius: range === '24h' ? 4 : 5,
            pointHoverRadius: 7,
            pointBackgroundColor: info.color,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            tension: 0.35,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 35, 45, 0.92)',
            titleFont: { size: 12, family: 'Inter, sans-serif' },
            bodyFont: { size: 12, family: 'Inter, sans-serif' },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (c) => `${info.label}: ${c.parsed.y}${info.unit}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#688490', font: { size: 10, family: 'Inter, sans-serif' } }
          },
          y: {
            grid: { color: 'rgba(180,200,208,.22)' },
            ticks: { color: '#688490', font: { size: 10, family: 'Inter, sans-serif' } }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [range, metric, dataset, info, values]);

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
