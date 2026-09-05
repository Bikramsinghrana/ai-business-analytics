import React, { useState } from 'react';

interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  color?: string;
}

interface InteractiveChartProps {
  type: 'bar' | 'line' | 'area' | 'pie' | 'kpi';
  data: DataPoint[];
  title?: string;
  height?: number;
  color?: string;
  unit?: string;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  type,
  data,
  title,
  height = 240,
  color = '#6366f1',
  unit = '',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-xl border border-slate-800 text-slate-500 text-sm">
        <span>No chart data available</span>
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values, 1);
  const totalValue = values.reduce((sum, v) => sum + v, 0);

  // BAR CHART
  if (type === 'bar') {
    return (
      <div className="space-y-2">
        {title && <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h4>}
        <div className="flex items-end gap-2 pt-6 pb-2 px-3 bg-slate-950/60 rounded-xl border border-slate-800/80 relative" style={{ height }}>
          {hoveredIndex !== null && (
            <div className="absolute top-2 left-4 px-2.5 py-1 rounded bg-slate-800 text-xs font-semibold text-white shadow-md border border-slate-700 flex items-center gap-1.5 animate-fadeIn">
              <span className="text-indigo-400 font-bold">{data[hoveredIndex].label}:</span>
              <span>{unit}{data[hoveredIndex].value.toLocaleString()}</span>
            </div>
          )}
          {data.map((item, idx) => {
            const barHeightPct = Math.max((item.value / maxValue) * 80, 5);
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  style={{
                    height: `${barHeightPct}%`,
                    background: isHovered
                      ? 'linear-gradient(180deg, #818cf8 0%, #4f46e5 100%)'
                      : `linear-gradient(180deg, ${color} 0%, rgba(79, 70, 229, 0.4) 100%)`,
                  }}
                  className={`w-full rounded-t-md transition-all duration-200 group-hover:scale-y-105 origin-bottom shadow-lg shadow-indigo-500/10 ${
                    isHovered ? 'ring-2 ring-indigo-400' : ''
                  }`}
                />
                <span className="text-[10px] text-slate-400 font-medium truncate max-w-full group-hover:text-white">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // LINE & AREA CHART
  if (type === 'line' || type === 'area') {
    const width = 500;
    const chartHeight = 180;
    const paddingX = 30;
    const paddingY = 20;

    const points = data.map((item, i) => {
      const x = paddingX + (i / Math.max(data.length - 1, 1)) * (width - paddingX * 2);
      const y = chartHeight - paddingY - (item.value / maxValue) * (chartHeight - paddingY * 2);
      return { x, y, ...item };
    });

    const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '');
    const areaD = `${pathD} L ${points[points.length - 1].x},${chartHeight - paddingY} L ${points[0].x},${chartHeight - paddingY} Z`;

    return (
      <div className="space-y-2">
        {title && <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h4>}
        <div className="relative bg-slate-950/60 rounded-xl border border-slate-800/80 p-3" style={{ height }}>
          {hoveredIndex !== null && (
            <div className="absolute top-2 right-4 px-2.5 py-1 rounded bg-slate-800 text-xs font-semibold text-white shadow border border-slate-700">
              <span className="text-indigo-400">{data[hoveredIndex].label}: </span>
              {unit}{data[hoveredIndex].value.toLocaleString()}
            </div>
          )}

          <svg viewBox={`0 0 ${width} ${chartHeight}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={color} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#334155" strokeDasharray="3,3" />
            <line x1={paddingX} y1={chartHeight / 2} x2={width - paddingX} y2={chartHeight / 2} stroke="#334155" strokeDasharray="3,3" />
            <line x1={paddingX} y1={chartHeight - paddingY} x2={width - paddingX} y2={chartHeight - paddingY} stroke="#334155" />

            {/* Area Fill */}
            <path d={areaD} fill="url(#areaGradient)" />

            {/* Line Path */}
            <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Points */}
            {points.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={hoveredIndex === i ? 5 : 3.5}
                fill={hoveredIndex === i ? '#ffffff' : color}
                stroke="#1e1b4b"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </svg>
        </div>
      </div>
    );
  }

  // PIE / DONUT CHART
  if (type === 'pie') {
    const radius = 60;
    const cx = 80;
    const cy = 80;
    let accumulatedAngle = 0;

    const defaultColors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];

    return (
      <div className="space-y-2">
        {title && <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h4>}
        <div className="flex items-center gap-6 bg-slate-950/60 rounded-xl border border-slate-800/80 p-4" style={{ height }}>
          <svg viewBox="0 0 160 160" className="w-36 h-36 flex-shrink-0">
            {data.map((item, idx) => {
              const sliceAngle = (item.value / totalValue) * 360;
              const startAngle = accumulatedAngle;
              accumulatedAngle += sliceAngle;

              const x1 = cx + radius * Math.cos((Math.PI * (startAngle - 90)) / 180);
              const y1 = cy + radius * Math.sin((Math.PI * (startAngle - 90)) / 180);
              const x2 = cx + radius * Math.cos((Math.PI * (startAngle + sliceAngle - 90)) / 180);
              const y2 = cy + radius * Math.sin((Math.PI * (startAngle + sliceAngle - 90)) / 180);
              const largeArc = sliceAngle > 180 ? 1 : 0;
              const sliceColor = item.color || defaultColors[idx % defaultColors.length];

              const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

              return (
                <path
                  key={idx}
                  d={pathData}
                  fill={sliceColor}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
            <circle cx={cx} cy={cy} r="32" fill="#090d16" />
          </svg>

          {/* Legend */}
          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-36 pr-1 custom-scrollbar">
            {data.map((item, idx) => {
              const sliceColor = item.color || defaultColors[idx % defaultColors.length];
              const pct = totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0;
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex items-center justify-between text-xs px-2 py-1 rounded transition-colors ${
                    isHovered ? 'bg-slate-800' : 'hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sliceColor }} />
                    <span className="text-slate-300 font-medium truncate max-w-[110px]">{item.label}</span>
                  </div>
                  <span className="text-slate-400 font-bold">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // KPI CARD
  return (
    <div className="bg-slate-950/60 rounded-xl border border-slate-800/80 p-5 flex flex-col justify-between" style={{ height }}>
      <div>
        {title && <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h4>}
        <div className="text-3xl font-extrabold text-white mt-2 tracking-tight">
          {unit}{data[0]?.value.toLocaleString() ?? 0}
        </div>
      </div>
      <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
        <span>▲ Trending positive</span>
        <span className="text-slate-500 font-normal">vs previous period</span>
      </div>
    </div>
  );
};
