"use client";

type Props = {
  onSelect: (x: number, y: number) => void;
  selectedX?: number;
  selectedY?: number;
};

export function GoalDiagram({ onSelect, selectedX, selectedY }: Props) {
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 3;
    const y = 0.9 - ((e.clientY - rect.top) / rect.height) * 0.9;
    onSelect(Math.round(x * 100) / 100, Math.round(y * 100) / 100);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <h3 className="text-sm text-gray-400 mb-2">Tap where the shot went</h3>
      <svg
        viewBox="0 0 300 90"
        className="w-full cursor-crosshair"
        onClick={handleClick}
      >
        <rect x="0" y="0" width="300" height="90" fill="#1f2937" stroke="#ffffff" strokeWidth="4" />

        {[...Array(10)].map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 30 + 15}
            y1="0"
            x2={i * 30 + 15}
            y2="90"
            stroke="#374151"
            strokeWidth="1"
          />
        ))}
        {[...Array(3)].map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * 30 + 15}
            x2="300"
            y2={i * 30 + 15}
            stroke="#374151"
            strokeWidth="1"
          />
        ))}

        <rect x="0" y="0" width="6" height="90" fill="#ffffff" />
        <rect x="294" y="0" width="6" height="90" fill="#ffffff" />
        <rect x="0" y="0" width="300" height="6" fill="#ffffff" />

        <text x="75" y="35" fill="#6b7280" fontSize="12" textAnchor="middle">Top L</text>
        <text x="150" y="35" fill="#6b7280" fontSize="12" textAnchor="middle">Top C</text>
        <text x="225" y="35" fill="#6b7280" fontSize="12" textAnchor="middle">Top R</text>
        <text x="75" y="70" fill="#6b7280" fontSize="12" textAnchor="middle">Bot L</text>
        <text x="150" y="70" fill="#6b7280" fontSize="12" textAnchor="middle">Bot C</text>
        <text x="225" y="70" fill="#6b7280" fontSize="12" textAnchor="middle">Bot R</text>

        {selectedX !== undefined && selectedY !== undefined && (
          <>
            <circle
              cx={selectedX * 100}
              cy={(0.9 - selectedY) * 100}
              r="12"
              fill="#22c55e"
              stroke="#ffffff"
              strokeWidth="3"
            />
            <circle
              cx={selectedX * 100}
              cy={(0.9 - selectedY) * 100}
              r="4"
              fill="#ffffff"
            />
          </>
        )}
      </svg>
    </div>
  );
}