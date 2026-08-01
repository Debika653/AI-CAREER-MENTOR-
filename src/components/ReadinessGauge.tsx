import React from 'react';

interface ReadinessGaugeProps {
  score: number; // 0 to 100
  size?: number;
  label?: string;
  sublabel?: string;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({
  score,
  size = 200,
  label = "Job Readiness Score",
  sublabel
}) => {
  const normalizedScore = Math.min(100, Math.max(0, score));
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // Semicircle
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Color selection based on score
  let strokeColor = "#f59e0b"; // amber
  let badgeBg = "bg-amber-50 text-amber-700 border-amber-200";
  let statusText = "Nearing Readiness";

  if (normalizedScore >= 80) {
    strokeColor = "#10b981"; // emerald
    badgeBg = "bg-emerald-50 text-emerald-700 border-emerald-200";
    statusText = "Market Ready";
  } else if (normalizedScore < 50) {
    strokeColor = "#ef4444"; // red
    badgeBg = "bg-rose-50 text-rose-700 border-rose-200";
    statusText = "Foundation Phase";
  }

  return (
    <div className="flex flex-col items-center justify-center p-2 text-center">
      <div className="relative" style={{ width: size, height: size / 2 + 25 }}>
        <svg
          width={size}
          height={size / 2 + strokeWidth}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d={`M ${strokeWidth / 2},${size / 2} a ${radius},${radius} 0 0,1 ${radius * 2},0`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Score Value Arc */}
          <path
            d={`M ${strokeWidth / 2},${size / 2} a ${radius},${radius} 0 0,1 ${radius * 2},0`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900">
            {normalizedScore}%
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeBg} mt-1`}>
            {statusText}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        {sublabel && <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
};
