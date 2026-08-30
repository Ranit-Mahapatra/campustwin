import React, { useState, useEffect, useRef } from 'react';
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

export default function MiniTrendChart() {
  const [range, setRange] = useState('24h');
  const [metric, setMetric] = useState('aqi');
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const dataset = baselineTrendData[range];
  const info = trendMetricInfo[metric];
  const values = dataset[metric];

  const peak = Math.max(...values);
  const peakIndex = values.indexOf(peak);
  const low = Math.min(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const change = ((values[values.length - 1] - values[0]) / values[0]) * 100;

  useEffect(() => {
    if (!canvasRef.current) return;

    // Safely destroy existing instance on ref or on canvas
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
            backgroundColor: info.bg || 'rgba(8,127,118,.07)',
            borderWidth: 2.3,
            pointRadius: range === '24h' ? 2.5 : 3,
            pointHoverRadius: 5,
            tension: 0.35,
            fill: true,
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
            callbacks: {
              label: (c) => `${info.label}: ${c.parsed.y}${info.unit}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#78909b', font: { size: 8 }, maxRotation: 0 }
          },
          y: {
            grid: { color: 'rgba(180,200,208,.28)' },
            ticks: { color: '#78909b', font: { size: 8 } }
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
    <div className="panel-card">
      <div className="panel-title">
        <span>Time-Based Urban Trend</span>
        <span style={{ fontSize: '9px', color: 'var(--muted)' }}>
          Peak: {peak}{info.unit} · {dataset.labels[peakIndex]}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <button
          className={`btn-secondary ${range === '24h' ? 'active' : ''}`}
          onClick={() => setRange('24h')}
          style={{ flex: 1, padding: '5px 8px', fontSize: '10px', justifyContent: 'center' }}
        >
          24 Hours
        </button>
        <button
          className={`btn-secondary ${range === '7d' ? 'active' : ''}`}
          onClick={() => setRange('7d')}
          style={{ flex: 1, padding: '5px 8px', fontSize: '10px', justifyContent: 'center' }}
        >
          7 Days
        </button>
      </div>

      <div style={{ display: 'flex', gap: '5px', marginBottom: '8px', overflowX: 'auto' }}>
        <button
          className={`btn-secondary ${metric === 'aqi' ? 'active' : ''}`}
          onClick={() => setMetric('aqi')}
          style={{ flex: 1, padding: '5px 6px', fontSize: '9px', justifyContent: 'center' }}
        >
          AQI
        </button>
        <button
          className={`btn-secondary ${metric === 'temp' ? 'active' : ''}`}
          onClick={() => setMetric('temp')}
          style={{ flex: 1, padding: '5px 6px', fontSize: '9px', justifyContent: 'center' }}
        >
          Temp
        </button>
        <button
          className={`btn-secondary ${metric === 'traffic' ? 'active' : ''}`}
          onClick={() => setMetric('traffic')}
          style={{ flex: 1, padding: '5px 6px', fontSize: '9px', justifyContent: 'center' }}
        >
          Traffic
        </button>
        <button
          className={`btn-secondary ${metric === 'pm25' ? 'active' : ''}`}
          onClick={() => setMetric('pm25')}
          style={{ flex: 1, padding: '5px 6px', fontSize: '9px', justifyContent: 'center' }}
        >
          PM2.5
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}>
        <span style={{ fontWeight: 700, color: 'var(--text)' }}>
          {info.label} · {range === '24h' ? '24-hour pattern' : '7-day pattern'}
        </span>
        <span>Avg: {avg.toFixed(1)}{info.unit}</span>
      </div>

      <div style={{ height: '180px', background: '#fbfdfe', border: '1px solid #e0eaee', borderRadius: '8px', padding: '6px 4px 2px', marginBottom: '8px' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '5px' }}>
        <span style={{ padding: '5px 4px', borderRadius: '6px', background: 'var(--panel2)', border: '1px solid #e0eaee', fontSize: '9px', color: 'var(--muted)', textAlign: 'center' }}>
          ● Modeled trend
        </span>
        <span style={{ padding: '5px 4px', borderRadius: '6px', background: 'var(--panel2)', border: '1px solid #e0eaee', fontSize: '9px', color: 'var(--muted)', textAlign: 'center' }}>
          Change: {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </span>
        <span style={{ padding: '5px 4px', borderRadius: '6px', background: 'var(--panel2)', border: '1px solid #e0eaee', fontSize: '9px', color: 'var(--muted)', textAlign: 'center' }}>
          Lowest: {low}{info.unit}
        </span>
      </div>
    </div>
  );
}
