import React from 'react';

interface RadarDataPoint {
  domain: string;
  current: number; // 0 to 100
  target: number;  // 0 to 100
}

interface CustomRadarChartProps {
  data: RadarDataPoint[];
  size?: number;
}

export const CustomRadarChart: React.FC<CustomRadarChartProps> = ({
  data,
  size = 300,
}) => {
  if (!data || data.length === 0) return null;

  const numAxes = data.length;
  const center = size / 2;
  const maxRadius = size / 2 - 40;
  const angleStep = (2 * Math.PI) / numAxes;

  // Helper to get coordinates for a value (0-100) at axis index
  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2; // start from top
    const r = (value / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Grid circles (levels: 25%, 50%, 75%, 100%)
  const levels = [25, 50, 75, 100];

  // Polygon points
  const currentPoints = data
    .map((point, i) => {
      const { x, y } = getCoordinates(point.current, i);
      return `${x},${y}`;
    })
    .join(' ');

  const targetPoints = data
    .map((point, i) => {
      const { x, y } = getCoordinates(point.target, i);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <svg width={size} height={size} className="overflow-visible">
        {/* Concentric Grid Levels */}
        {levels.map((level) => {
          const r = (level / 100) * maxRadius;
          return (
            <circle
              key={level}
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke="#e2e8f0"
              strokeDasharray={level === 100 ? "none" : "2,2"}
              strokeWidth={1}
            />
          );
        })}

        {/* Axis Lines and Labels */}
        {data.map((point, i) => {
          const outerCoord = getCoordinates(100, i);
          const labelCoord = getCoordinates(118, i);

          return (
            <g key={point.domain}>
              {/* Axis Line */}
              <line
                x1={center}
                y1={center}
                x2={outerCoord.x}
                y2={outerCoord.y}
                stroke="#cbd5e1"
                strokeWidth={1}
              />
              {/* Label */}
              <text
                x={labelCoord.x}
                y={labelCoord.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[11px] font-semibold fill-slate-700"
              >
                {point.domain}
              </text>
            </g>
          );
        })}

        {/* Target Benchmark Area */}
        <polygon
          points={targetPoints}
          fill="rgba(203, 213, 225, 0.25)"
          stroke="#94a3b8"
          strokeWidth={1.5}
          strokeDasharray="4,3"
        />

        {/* Current User Skill Area */}
        <polygon
          points={currentPoints}
          fill="rgba(59, 130, 246, 0.3)"
          stroke="#2563eb"
          strokeWidth={2.5}
          className="transition-all duration-700 ease-in-out"
        />

        {/* Data Points */}
        {data.map((point, i) => {
          const { x, y } = getCoordinates(point.current, i);
          return (
            <circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r={4}
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth={2}
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-2 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
          <span>Your Skill Level</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border-2 border-dashed border-slate-400 bg-slate-100 inline-block"></span>
          <span>Target Benchmark</span>
        </div>
      </div>
    </div>
  );
};
