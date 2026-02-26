"use client"

type Props = {
  onSelect: (x: number, y: number) => void;
  selectedX?: number;
  selectedY?: number;
};

export function PoolDiagram({ onSelect, selectedX, selectedY }: Props) {
    const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
        const svg = event.currentTarget;
        const rect = svg.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 25;
        const y = ((event.clientY - rect.top) / rect.height) * 20;
        onSelect(Math.round(x * 10) / 10, Math.round(y * 10) / 10);
    };
    return (
    <div className="bg-gray-900 rounded-xl p-4">
      <h3 className="text-sm text-gray-400 mb-2">Tap shot location on pool</h3>
      <svg
        viewBox="0 0 250 200"
        className="w-full cursor-crosshair"
        onClick={handleClick}
      >
        {/* Pool background */}
        <rect x="0" y="0" width="250" height="200" fill="#1e40af" rx="4" />

        {/* Lane lines */}
        {/* 2m line */}
        <line x1="20" y1="0" x2="20" y2="200" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4" />
        <line x1="230" y1="0" x2="230" y2="200" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4" />
        
        {/* 5m line */}
        <line x1="50" y1="0" x2="50" y2="200" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="200" y1="0" x2="200" y2="200" stroke="#f59e0b" strokeWidth="1.5" />

        {/* Half line */}
        <line x1="125" y1="0" x2="125" y2="200" stroke="#ffffff" strokeWidth="1" />

        {/* Goals */}
        <rect x="0" y="70" width="4" height="60" fill="#ffffff" />
        <rect x="246" y="70" width="4" height="60" fill="#ef4444" />

        {/* Labels */}
        <text x="20" y="195" fill="#3b82f6" fontSize="8" textAnchor="middle">2m</text>
        <text x="50" y="195" fill="#f59e0b" fontSize="8" textAnchor="middle">5m</text>
        <text x="125" y="195" fill="#ffffff" fontSize="8" textAnchor="middle">Half</text>
        <text x="200" y="195" fill="#f59e0b" fontSize="8" textAnchor="middle">5m</text>
        <text x="230" y="195" fill="#3b82f6" fontSize="8" textAnchor="middle">2m</text>

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
          Position: {selectedX}m x {selectedY}m
        </p>
      )}
    </div>
  );
}