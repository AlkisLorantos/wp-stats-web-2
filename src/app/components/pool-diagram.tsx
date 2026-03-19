"use client";

type Props = {
  onSelect: (x: number, y: number) => void;
  selectedX?: number;
  selectedY?: number;
};

export function PoolDiagram({ onSelect, selectedX, selectedY }: Props) {
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 25;
    const y = ((e.clientY - rect.top) / rect.height) * 20;
    onSelect(Math.round(x * 10) / 10, Math.round(y * 10) / 10);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-400">Tap shot location</span>
        <div className="flex items-center gap-2 text-red-400 font-medium">
          <span>Attacking</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <svg
        viewBox="0 0 250 200"
        className="w-full cursor-crosshair"
        onClick={handleClick}
      >
        {/* Pool background - lighter blue */}
        <rect x="0" y="0" width="250" height="200" fill="#3b82f6" rx="4" />

        {/* 2m lines - red */}
        <line x1="20" y1="0" x2="20" y2="200" stroke="#ef4444" strokeWidth="1" opacity="0.7" />
        <line x1="230" y1="0" x2="230" y2="200" stroke="#ef4444" strokeWidth="1" opacity="0.7" />

        {/* 6m lines - yellow */}
        <line x1="60" y1="0" x2="60" y2="200" stroke="#fbbf24" strokeWidth="1" opacity="0.7" />
        <line x1="190" y1="0" x2="190" y2="200" stroke="#fbbf24" strokeWidth="1" opacity="0.7" />

        {/* Half line - white */}
        <line x1="125" y1="0" x2="125" y2="200" stroke="#ffffff" strokeWidth="1" opacity="0.4" />

        {/* Our goal (left) */}
        <rect x="0" y="70" width="5" height="60" fill="#ffffff" opacity="0.8" />

        {/* Opponent goal (right - where we shoot) */}
        <rect x="245" y="70" width="5" height="60" fill="#ef4444" />

        {/* Attack arrow on pool */}
        <polygon points="240,100 225,92 225,108" fill="#ef4444" opacity="0.8" />
        <line x1="200" y1="100" x2="225" y2="100" stroke="#ef4444" strokeWidth="3" opacity="0.8" />

        {/* Labels at bottom */}
        <text x="20" y="192" fill="#fca5a5" fontSize="7" textAnchor="middle">2m</text>
        <text x="60" y="192" fill="#fcd34d" fontSize="7" textAnchor="middle">6m</text>
        <text x="190" y="192" fill="#fcd34d" fontSize="7" textAnchor="middle">6m</text>
        <text x="230" y="192" fill="#fca5a5" fontSize="7" textAnchor="middle">2m</text>

        {/* Selected point */}
        {selectedX !== undefined && selectedY !== undefined && (
          <>
            <circle
              cx={selectedX * 10}
              cy={selectedY * 10}
              r="8"
              fill="#22c55e"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <circle
              cx={selectedX * 10}
              cy={selectedY * 10}
              r="3"
              fill="#ffffff"
            />
          </>
        )}
      </svg>

      {selectedX !== undefined && selectedY !== undefined && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          {selectedX}m from goal line
        </p>
      )}
    </div>
  );
}