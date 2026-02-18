"use client";

import { useState } from "react";
import { createStat, deleteStat } from "@/lib/stats";

type Player = {
  id: number;
  name: string;
  capNumber?: number;
};

type RosterPlayer = {
  id: number;
  capNumber: number;
  playerId: number;
  player: Player;
};

type StatEvent = {
  id: number;
  type: string;
  context?: string;
  period?: number;
  playerId: number;
  player: Player;
};

type Props = {
  gameId: number;
  roster: RosterPlayer[];
  stats: StatEvent[];
};

const eventTypes = [
  { key: "GOAL", label: "Goal", color: "bg-green-600 hover:bg-green-700" },
  { key: "SHOT", label: "Shot", color: "bg-blue-600 hover:bg-blue-700" },
  { key: "ASSIST", label: "Assist", color: "bg-purple-600 hover:bg-purple-700" },
  { key: "STEAL", label: "Steal", color: "bg-yellow-600 hover:bg-yellow-700" },
  { key: "BLOCK", label: "Block", color: "bg-orange-600 hover:bg-orange-700" },
  { key: "EXCLUSION", label: "Exclusion", color: "bg-red-600 hover:bg-red-700" },
  { key: "TURNOVER", label: "Turnover", color: "bg-gray-600 hover:bg-gray-700" },
];

const situations = [
  { key: "", label: "Normal" },
  { key: "SIX_ON_SIX", label: "6v6" },
  { key: "MAN_UP", label: "Man Up" },
  { key: "MAN_DOWN", label: "Man Down" },
  { key: "COUNTER", label: "Counter" },
  { key: "PENALTY", label: "Penalty" },
];

export function LiveTracker({ gameId, roster, stats }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [situation, setSituation] = useState("");
  const [period, setPeriod] = useState(1);
  const [recording, setRecording] = useState(false);
  const [lastRecorded, setLastRecorded] = useState<string | null>(null);

  const handleRecordEvent = async (eventType: string) => {
    if (!selectedPlayer || recording) return;

    setRecording(true);
    setLastRecorded(null);

    const formData = new FormData();
    formData.set("playerId", selectedPlayer.toString());
    formData.set("type", eventType);
    formData.set("period", period.toString());
    if (situation) formData.set("context", situation);

    const result = await createStat(gameId, formData);
    
    if (result.success) {
      const player = roster.find((r) => r.playerId === selectedPlayer);
      setLastRecorded(`${eventType} - #${player?.capNumber} ${player?.player.name}`);
      setSelectedPlayer(null);
    }

    setRecording(false);
  };

  const handleUndo = async () => {
    if (stats.length === 0) return;
    const lastStat = stats[stats.length - 1];
    await deleteStat(gameId, lastStat.id);
    setLastRecorded(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Players */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Select Player</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Period:</span>
              <select
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
              >
                {[1, 2, 3, 4].map((p) => (
                  <option key={p} value={p}>Q{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {roster
              .sort((a, b) => a.capNumber - b.capNumber)
              .map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedPlayer(r.playerId)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    selectedPlayer === r.playerId
                      ? "bg-blue-600 ring-2 ring-blue-400 scale-105"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <div className="text-2xl font-bold">{r.capNumber}</div>
                  <div className="text-xs text-gray-300 truncate">{r.player.name.split(" ")[0]}</div>
                </button>
              ))}
          </div>
        </div>

        {/* Situation Selector */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Situation</h2>
          <div className="grid grid-cols-3 gap-2">
            {situations.map((s) => (
              <button
                key={s.key}
                onClick={() => setSituation(s.key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  situation === s.key
                    ? "bg-blue-600 ring-2 ring-blue-400"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Column - Event Buttons */}
      <div className="lg:col-span-1">
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">
            {selectedPlayer 
              ? `Record for #${roster.find(r => r.playerId === selectedPlayer)?.capNumber}`
              : "Select a player first"
            }
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {eventTypes.map((event) => (
              <button
                key={event.key}
                onClick={() => handleRecordEvent(event.key)}
                disabled={!selectedPlayer || recording}
                className={`p-4 rounded-xl text-lg font-semibold transition-all ${event.color} ${
                  !selectedPlayer || recording
                    ? "opacity-50 cursor-not-allowed"
                    : "active:scale-95"
                }`}
              >
                {event.label}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {lastRecorded && (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-center animate-pulse">
              ✓ {lastRecorded}
            </div>
          )}

          {/* Undo Button */}
          <button
            onClick={handleUndo}
            disabled={stats.length === 0}
            className="w-full mt-4 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Undo Last
          </button>
        </div>
      </div>

      {/* Right Column - Event Log */}
      <div className="lg:col-span-1">
        <div className="bg-gray-800 rounded-xl p-4 h-full">
          <h2 className="text-lg font-semibold mb-4">Event Log</h2>
          
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {stats.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No events yet</p>
            ) : (
              [...stats].reverse().map((stat) => (
                <div
                  key={stat.id}
                  className="flex justify-between items-center py-2 px-3 bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded font-medium ${
                      stat.type === "GOAL" ? "bg-green-500/20 text-green-400" :
                      stat.type === "EXCLUSION" ? "bg-red-500/20 text-red-400" :
                      stat.type === "ASSIST" ? "bg-purple-500/20 text-purple-400" :
                      "bg-gray-600 text-gray-300"
                    }`}>
                      {stat.type}
                    </span>
                    <span className="text-sm">{stat.player.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">P{stat.period || "-"}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}