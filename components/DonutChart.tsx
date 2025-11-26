"use client";

interface Slice {
  label: string;
  value: number;
  color: string;
}

export default function DonutChart({
  slices,
  size = 180,
  thickness = 18,
}: {
  slices: Slice[];
  size?: number;
  thickness?: number;
}) {
  const total = slices.reduce((acc, s) => acc + s.value, 0);

  // === FIX PENTING: padding agar stroke tidak kepotong ===
  const padding = thickness / 2 + 4;
  const radius = size / 2 - padding;

  const getCoordinatesForPercent = (percent: number): [number, number] => {
    const x = Math.cos(2 * Math.PI * percent) * radius;
    const y = Math.sin(2 * Math.PI * percent) * radius;
    return [x, y];
  };

  // Hitung semua path sekaligus dengan cumulative yang aman
  const slicesPaths = slices.map((slice, index, array) => {
    // Hitung cumulative percent sampai slice sebelumnya
    const previousPercent = array
      .slice(0, index)
      .reduce((acc, s) => acc + s.value / total, 0);

    const percent = slice.value / total;
    const [startX, startY] = getCoordinatesForPercent(previousPercent);
    const [endX, endY] = getCoordinatesForPercent(previousPercent + percent);

    const largeArcFlag = percent > 0.5 ? 1 : 0;

    return {
      path: `
        M ${startX} ${startY}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      `,
      color: slice.color,
      percent: Math.round(percent * 100),
      label: slice.label,
    };
  });

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Track background pakai circle */}
        <circle
          cx={0}
          cy={0}
          r={radius}
          fill="none"
          stroke="#eee"
          strokeWidth={thickness}
        />

        {slicesPaths.map((slice, idx) => (
          <path
            key={idx}
            d={slice.path}
            stroke={slice.color}
            strokeWidth={thickness}
            fill="none"
            strokeLinecap="butt"
          />
        ))}
      </svg>

      {/* LABEL */}
      <div className="grid grid-cols-1 gap-1 mt-2 text-sm">
        {slicesPaths.map((slice, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded"
              style={{ backgroundColor: slice.color }}
            />
            <span className="font-medium">{slice.label}:</span>
            <span>{slice.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}