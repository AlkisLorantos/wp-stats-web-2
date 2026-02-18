"use client";

import { useState } from "react";
import { createStat, deleteStat, updateStat } from "@/lib/stats";
import { createSubstitution } from "@/lib/substitutions";
import { saveStartingLineup } from "@/lib/lineup";

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
  clock?: number;
  playerId: number;
  player: Player;
};

type Substitution = {
  id: number;
  period: number;
  time: number;
  playerInId: number;
  playerOutId: number;
  playerIn: { id: number; name: string };
  playerOut: { id: number; name: string };
};

type Props = {
  gameId: number;
  roster: RosterPlayer[];
  stats: StatEvent[];
  substitutions: Substitution[];
  lineups: Record<number, number[]>;
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

function formatClock(minutes: number): string {
  const mins = Math.floor(minutes);
  const secs = Math.round((minutes - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function LiveTracker({ gameId, roster, stats, substitutions, lineups }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [situation, setSituation] = useState("");
  const [period, setPeriod] = useState(1);
  const [minutes, setMinutes] = useState(8);
  const [seconds, setSeconds] = useState(0);
  const [recording, setRecording] = useState(false);
  const [lastRecorded, setLastRecorded] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<StatEvent | null>(null);
  
  const [activeTab, setActiveTab] = useState<"stats" | "subs">("stats");
  const [inWater, setInWater] = useState<number[]>(lineups[period] || []);
  const [playerOut, setPlayerOut] = useState<number | null>(null);
  const [playerIn, setPlayerIn] = useState<number | null>(null);

  const onBench = roster.filter((r) => !inWater.includes(r.playerId));

  const handleRecordEvent = async (eventType: string) => {
    if (!selectedPlayer || recording) return;

    setRecording(true);
    setLastRecorded(null);

    const clockValue = minutes + seconds / 60;

    const formData = new FormData();
    formData.set("playerId", selectedPlayer.toString());
    formData.set("type", eventType);
    formData.set("period", period.toString());
    formData.set("clock", clockValue.toString());
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

  const handleDelete = async (statId: number) => {
    await deleteStat(gameId, statId);
  };

  const handleEdit = (stat: StatEvent) => {
    setEditingEvent(stat);
    setSelectedPlayer(stat.playerId);
    setPeriod(stat.period || 1);
    if (stat.clock !== undefined && stat.clock !== null) {
      setMinutes(Math.floor(stat.clock));
      setSeconds(Math.round((stat.clock - Math.floor(stat.clock)) * 60));
    }
    setSituation(stat.context || "");
  };

  const handleUpdateEvent = async (eventType: string) => {
    if (!editingEvent || !selectedPlayer || recording) return;

    setRecording(true);

    const clockValue = minutes + seconds / 60;

    const result = await updateStat(gameId, editingEvent.id, {
      playerId: selectedPlayer,
      type: eventType,
      period,
      clock: clockValue,
      context: situation || undefined,
    });

    if (result.success) {
      setEditingEvent(null);
      setSelectedPlayer(null);
      setSituation("");
    }

    setRecording(false);
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setSelectedPlayer(null);
    setSituation("");
    setMinutes(8);
    setSeconds(0);
  };

  const handleSaveLineup = async () => {
    if (inWater.length !== 7) {
      alert("Starting lineup must have exactly 7 players");
      return;
    }
    await saveStartingLineup(gameId, period, inWater);
  };

  const handleSubstitution = async () => {
    if (!playerIn || !playerOut) return;

    const clockValue = minutes * 60 + seconds;

    const result = await createSubstitution(gameId, {
      period,
      time: clockValue,
      playerInId: playerIn,
      playerOutId: playerOut,
    });

    if (result.success) {
      setInWater((prev) => [...prev.filter((id) => id !== playerOut), playerIn]);
      setPlayerIn(null);
      setPlayerOut(null);
    }
  };

  const handlePeriodChange = (newPeriod: number) => {
    setPeriod(newPeriod);
    setInWater(lineups[newPeriod] || []);
    setMinutes(8);
    setSeconds(0);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">Period</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((p) => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  className={`w-12 h-12 rounded-lg font-bold text-xl transition-all ${
                    period === p
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">Time</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={8}
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(8, Number(e.target.value))))}
                className="w-16 h-12 bg-gray-700 border border-gray-600 rounded-lg text-center text-2xl font-mono font-bold"
              />
              <span className="text-2xl font-bold text-gray-400">:</span>
              <input
                type="number"
                min={0}
                max={59}
                value={seconds.toString().padStart(2, "0")}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, Number(e.target.value))))}
                className="w-16 h-12 bg-gray-700 border border-gray-600 rounded-lg text-center text-2xl font-mono font-bold"
              />
            </div>
            <div className="flex gap-1">
              {[8, 6, 4, 2, 0].map((m) => (
                <button
                  key={m}
                  onClick={() => { setMinutes(m); setSeconds(0); }}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium"
                >
                  {m}:00
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "stats" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Stats
            </button>
            <button
              onClick={() => setActiveTab("subs")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "subs" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Subs
            </button>
          </div>
        </div>
      </div>

      {editingEvent && (
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-yellow-400 font-medium">
              Editing: {editingEvent.type} - {editingEvent.player.name}
            </span>
            <button
              onClick={cancelEdit}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {activeTab === "stats" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4">Select Player</h2>

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
                      <div className="text-xs text-gray-300 truncate">
                        {r.player.name.split(" ")[0]}
                      </div>
                    </button>
                  ))}
              </div>
            </div>

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

          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4">
                {editingEvent
                  ? `Update event for #${roster.find((r) => r.playerId === selectedPlayer)?.capNumber || "?"}`
                  : selectedPlayer
                  ? `Record for #${roster.find((r) => r.playerId === selectedPlayer)?.capNumber}`
                  : "Select a player first"}
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {eventTypes.map((event) => (
                  <button
                    key={event.key}
                    onClick={() => editingEvent ? handleUpdateEvent(event.key) : handleRecordEvent(event.key)}
                    disabled={!selectedPlayer || recording}
                    className={`p-4 rounded-xl text-lg font-semibold transition-all ${event.color} ${
                      !selectedPlayer || recording
                        ? "opacity-50 cursor-not-allowed"
                        : "active:scale-95"
                    } ${editingEvent?.type === event.key ? "ring-2 ring-white" : ""}`}
                  >
                    {event.label}
                  </button>
                ))}
              </div>

              {lastRecorded && !editingEvent && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-center animate-pulse">
                  ✓ {lastRecorded}
                </div>
              )}

              {!editingEvent && (
                <button
                  onClick={handleUndo}
                  disabled={stats.length === 0}
                  className="w-full mt-4 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Undo Last
                </button>
              )}
            </div>
          </div>

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
                      className={`flex justify-between items-center py-2 px-3 rounded-lg group ${
                        editingEvent?.id === stat.id
                          ? "bg-yellow-500/20 border border-yellow-500"
                          : "bg-gray-700/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs rounded font-medium ${
                            stat.type === "GOAL"
                              ? "bg-green-500/20 text-green-400"
                              : stat.type === "EXCLUSION"
                              ? "bg-red-500/20 text-red-400"
                              : stat.type === "ASSIST"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-gray-600 text-gray-300"
                          }`}
                        >
                          {stat.type}
                        </span>
                        <span className="text-sm">{stat.player.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {stat.clock !== undefined && stat.clock !== null
                            ? formatClock(stat.clock)
                            : "--:--"}{" "}
                          Q{stat.period || "-"}
                        </span>
                        <div className="hidden group-hover:flex gap-1">
                          <button
                            onClick={() => handleEdit(stat)}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(stat.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "subs" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">In Water ({inWater.length}/7)</h2>
                {inWater.length === 7 && (
                  <button
                    onClick={handleSaveLineup}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm"
                  >
                    Save as Q{period} Lineup
                  </button>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {roster
                  .filter((r) => inWater.includes(r.playerId))
                  .sort((a, b) => a.capNumber - b.capNumber)
                  .map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setPlayerOut(r.playerId)}
                      className={`p-3 rounded-lg text-center transition-all ${
                        playerOut === r.playerId
                          ? "bg-red-600 ring-2 ring-red-400"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      <div className="text-2xl font-bold">{r.capNumber}</div>
                      <div className="text-xs truncate">{r.player.name.split(" ")[0]}</div>
                    </button>
                  ))}
              </div>

              {inWater.length < 7 && (
                <p className="text-yellow-400 text-sm mt-4">
                  Select {7 - inWater.length} more player(s) from bench to complete lineup
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4">On Bench</h2>

              <div className="grid grid-cols-4 gap-2">
                {onBench
                  .sort((a, b) => a.capNumber - b.capNumber)
                  .map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        if (inWater.length < 7 && !playerOut) {
                          setInWater((prev) => [...prev, r.playerId]);
                        } else {
                          setPlayerIn(r.playerId);
                        }
                      }}
                      className={`p-3 rounded-lg text-center transition-all ${
                        playerIn === r.playerId
                          ? "bg-green-600 ring-2 ring-green-400"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      <div className="text-2xl font-bold">{r.capNumber}</div>
                      <div className="text-xs text-gray-300 truncate">
                        {r.player.name.split(" ")[0]}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
            {playerOut && playerIn && (
              <div className="bg-gray-800 rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-4">Confirm Substitution</h2>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-red-400 text-sm">OUT</div>
                    <div className="text-2xl font-bold">
                      #{roster.find((r) => r.playerId === playerOut)?.capNumber}
                    </div>
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="text-center">
                    <div className="text-green-400 text-sm">IN</div>
                    <div className="text-2xl font-bold">
                      #{roster.find((r) => r.playerId === playerIn)?.capNumber}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSubstitution}
                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => { setPlayerIn(null); setPlayerOut(null); }}
                    className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4">Substitution Log</h2>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {substitutions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No substitutions yet</p>
                ) : (
                  [...substitutions].reverse().map((sub) => (
                    <div key={sub.id} className="py-2 px-3 bg-gray-700/50 rounded-lg text-sm">
                      <span className="text-red-400">{sub.playerOut.name}</span>
                      <span className="text-gray-400 mx-2">→</span>
                      <span className="text-green-400">{sub.playerIn.name}</span>
                      <span className="text-gray-500 ml-2">
                        Q{sub.period} {formatSeconds(sub.time)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}