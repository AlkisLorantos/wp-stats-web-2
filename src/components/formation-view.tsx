"use client";

import type { RosterPlayer, Position, Formation } from "@/types";

type Props = {
  formation: Formation;
  roster: RosterPlayer[];
  onPositionClick: (position: Position) => void;
  selectedPosition: Position | null;
};

export function FormationView({ formation, roster, onPositionClick, selectedPosition }: Props) {
  const getPlayerForPosition = (position: Position) => {
    const playerId = formation[position];
    if (!playerId) return null;
    return roster.find((r) => r.playerId === playerId);
  };

  const PositionSpot = ({ position, className }: { position: Position; className: string }) => {
    const player = getPlayerForPosition(position);
    const isSelected = selectedPosition === position;
    const isGK = position === "GK";

    return (
      <button
        onClick={() => onPositionClick(position)}
        className={`absolute ${className} w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all ${
          player
            ? isGK
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-700 border-2 border-dashed border-gray-500 hover:border-gray-400"
        } ${isSelected ? "ring-2 ring-yellow-400 scale-110" : ""}`}
      >
        {player ? (
          <>
            <span className="text-lg font-bold">{player.capNumber}</span>
            <span className="text-xs truncate max-w-12">{player.player.name.split(" ")[0]}</span>
          </>
        ) : (
          <span className="text-xs text-gray-400">{position}</span>
        )}
      </button>
    );
  };

  return (
    <div className="relative h-80 bg-blue-900/30 rounded-xl border border-blue-800">
      {/* Goal at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3 bg-white/50 rounded-b" />

      {/* GK */}
      <PositionSpot position="GK" className="top-6 left-1/2 -translate-x-1/2" />

      {/* Wings + Center Back */}
      <PositionSpot position="LW" className="top-24 left-4" />
      <PositionSpot position="CB" className="top-24 left-1/2 -translate-x-1/2" />
      <PositionSpot position="RW" className="top-24 right-4" />

      {/* Drivers */}
      <PositionSpot position="LD" className="top-44 left-12" />
      <PositionSpot position="RD" className="top-44 right-12" />

      {/* Center */}
      <PositionSpot position="C" className="bottom-6 left-1/2 -translate-x-1/2" />
    </div>
  );
}