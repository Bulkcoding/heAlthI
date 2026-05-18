type TrendChartProps = {
  values: number[];
};

export function TrendChart({ values }: TrendChartProps) {
  const width = 480;
  const height = 160;
  const max = Math.max(...values);
  const min = Math.min(...values);

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const normalized = max === min ? 0.5 : (value - min) / (max - min);
      const y = height - normalized * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="trend-chart">
      <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        <defs>
          <linearGradient id="volumeLine" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#88d3ce" />
            <stop offset="100%" stopColor="#6e93f7" />
          </linearGradient>
        </defs>
        <polyline
          className="trend-chart__line"
          fill="none"
          points={points}
          stroke="url(#volumeLine)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="trend-chart__labels">
        <span>5/07</span>
        <span>5/09</span>
        <span>5/11</span>
        <span>5/13</span>
      </div>
    </div>
  );
}
