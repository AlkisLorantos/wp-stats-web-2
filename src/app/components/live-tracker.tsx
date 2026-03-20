"use client";

import { useState, useEffect } from "react";
import {
  createStat,
  deleteStat,
  updateStat,
  createShotWithLocation,
} from "@/lib/stats";
import { createSubstitution } from "@/lib/substitutions";
import { saveStartingLineup } from "@/lib/lineup";
import type {
  RosterPlayer,
  StatEvent,
  Substitution,
  Position,
  Formation,
  Game,
} from "@/types";
import { startGame, endGame } from "@/lib/games";
import { isGoalkeeper, formatClock, formatSeconds } from "@/lib/utils";
import { ShotLocationModal } from "./shot-location-modal";
import { FormationView } from "./formation-view";
import { BoxScore } from "./box-score";

type Props = {
  gameId: number;
  game: Game;
  roster: RosterPlayer[];
  stats: StatEvent[];
  substitutions: Substitution[];
  lineups: Record<number, number[]>;
};

const allEventTypes = [
  {
    key: "GOAL",
    label: "Goal",
    color: "bg-green-600 hover:bg-green-700",
    gkOnly: false,
    fieldOnly: false,
  },
  {
    key: "SHOT",
    label: "Shot",
    color: "bg-blue-600 hover:bg-blue-700",
    gkOnly: false,
    fieldOnly: false,
  },
  {
    key: "STEAL",
    label: "Steal",
    color: "bg-yellow-600 hover:bg-yellow-700",
    gkOnly: false,
    fieldOnly: false,
  },
  {
    key: "BLOCK",
    label: "Block",
    color: "bg-orange-600 hover:bg-orange-700",
    gkOnly: false,
    fieldOnly: true,
  },
  {
    key: "SAVE",
    label: "Save",
    color: "bg-cyan-600 hover:bg-cyan-700",
    gkOnly: true,
    fieldOnly: false,
  },
  {
    key: "EXCLUSION",
    label: "Exclusion",
    color: "bg-red-600 hover:bg-red-700",
    gkOnly: false,
    fieldOnly: false,
  },
  {
    key: "TURNOVER",
    label: "Turnover",
    color: "bg-gray-600 hover:bg-gray-700",
    gkOnly: false,
    fieldOnly: false,
  },
];

const situations = [
  { key: "", label: "Normal" },
  { key: "SIX_ON_SIX", label: "6v6" },
  { key: "MAN_UP", label: "Man Up" },
  { key: "MAN_DOWN", label: "Man Down" },
  { key: "COUNTER", label: "Counter" },
  { key: "PENALTY", label: "Penalty" },
];

export function LiveTracker({
  gameId,
  game,
  roster,
  stats,
  substitutions,
  lineups,
}: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [situation, setSituation] = useState("");
  const [period, setPeriod] = useState(1);
  const [minutes, setMinutes] = useState(8);
  const [seconds, setSeconds] = useState(0);
  const [recording, setRecording] = useState(false);
  const [lastRecorded, setLastRecorded] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<StatEvent | null>(null);

  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);

  const [activeTab, setActiveTab] = useState<"stats" | "subs" | "boxscore">(
    "stats",
  );
  const [playerOut, setPlayerOut] = useState<number | null>(null);
  const [playerIn, setPlayerIn] = useState<number | null>(null);

  const [showShotModal, setShowShotModal] = useState(false);
  const [isGoalShot, setIsGoalShot] = useState(false);
  const [shotPlayer, setShotPlayer] = useState<RosterPlayer | null>(null);

  const [formation, setFormation] = useState<Formation>({
    GK: null,
    LW: null,
    RW: null,
    LD: null,
    RD: null,
    CB: null,
    C: null,
  });
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null,
  );
  const [assigningPosition, setAssigningPosition] = useState<Position | null>(
    null,
  );

  const [lineupSaved, setLineupSaved] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  useEffect(() => {
    const periodLineup = lineups[period];
    if (periodLineup && periodLineup.length === 7) {
      const positions: Position[] = ["GK", "LW", "CB", "RW", "LD", "RD", "C"];
      const newFormation: Formation = {
        GK: null,
        LW: null,
        CB: null,
        RW: null,
        LD: null,
        RD: null,
        C: null,
      };

      periodLineup.forEach((playerId, index) => {
        if (positions[index]) {
          newFormation[positions[index]] = playerId;
        }
      });

      setFormation(newFormation);
      setLineupSaved((prev) => ({ ...prev, [period]: true }));
    } else {
      setFormation({
        GK: null,
        LW: null,
        CB: null,
        RW: null,
        LD: null,
        RD: null,
        C: null,
      });
      setLineupSaved((prev) => ({ ...prev, [period]: false }));
    }
  }, [period, lineups]);

  const playersInFormation = Object.values(formation).filter(
    Boolean,
  ) as number[];
  const onBench = roster.filter(
    (r) => !playersInFormation.includes(r.playerId),
  );

  const selectedRosterPlayer = roster.find(
    (r) => r.playerId === selectedPlayer,
  );
  const isSelectedGK = selectedPlayer ? formation.GK === selectedPlayer : false;

  const eventTypes = allEventTypes.filter((e) => {
    if (e.gkOnly && !isSelectedGK) return false;
    if (e.fieldOnly && isSelectedGK) return false;
    return true;
  });

  const canRecordStats = Object.values(formation).filter(Boolean).length > 0;

  const handleRecordEvent = async (eventType: string) => {
    if (!selectedPlayer || recording || !canRecordStats) return;

    const clockValue = minutes + seconds / 60;

    if (eventType === "SHOT" || eventType === "GOAL") {
      const player = roster.find((r) => r.playerId === selectedPlayer);
      if (player) {
        setShotPlayer(player);
        setIsGoalShot(eventType === "GOAL");
        setShowShotModal(true);
        setSelectedPlayer(null);
      }
      return;
    }

    setRecording(true);
    setLastRecorded(null);

    const formData = new FormData();
    formData.set("playerId", selectedPlayer.toString());
    formData.set("type", eventType);
    formData.set("period", period.toString());
    formData.set("clock", clockValue.toString());
    if (situation) formData.set("context", situation);

    try {
      await createStat(gameId, formData);
      const player = roster.find((r) => r.playerId === selectedPlayer);
      setLastRecorded(
        `${eventType} - #${player?.capNumber} ${player?.player.name}`,
      );
      setSelectedPlayer(null);
    } catch (err) {
      alert("Failed to record stat");
    }

    setRecording(false);
  };

  const handleShotSubmit = async (data: {
    poolX: number;
    poolY: number;
    goalX: number;
    goalY: number;
    outcome: string;
    assisterId?: number;
  }) => {
    if (!shotPlayer) return;

    setRecording(true);
    setShowShotModal(false);

    const clockValue = minutes + seconds / 60;

    try {
      await createShotWithLocation(gameId, {
        playerId: shotPlayer.playerId,
        x: data.poolX,
        y: data.poolY,
        goalX: data.goalX,
        goalY: data.goalY,
        shotOutcome: data.outcome,
        assisterId: data.assisterId,
        period,
        clock: clockValue,
        context: situation || undefined,
      });

      const outcomeText =
        data.outcome === "GOAL" ? "GOAL" : `SHOT (${data.outcome})`;
      setLastRecorded(
        `${outcomeText} - #${shotPlayer.capNumber} ${shotPlayer.player.name}`,
      );
    } catch (err) {
      alert("Failed to record shot");
    }

    setShotPlayer(null);
    setRecording(false);
  };

  const handleUndo = async () => {
    if (stats.length === 0) return;
    const lastStat = stats[stats.length - 1];
    try {
      await deleteStat(gameId, lastStat.id);
      setLastRecorded(null);
    } catch (err) {
      alert("Failed to undo");
    }
  };

  const handleDelete = async (statId: number) => {
    try {
      await deleteStat(gameId, statId);
    } catch (err) {
      alert("Failed to delete");
    }
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

    try {
      await updateStat(gameId, editingEvent.id, {
        playerId: selectedPlayer,
        type: eventType,
        period,
        clock: clockValue,
        context: situation || undefined,
      });

      setEditingEvent(null);
      setSelectedPlayer(null);
      setSituation("");
    } catch (err) {
      alert("Failed to update stat");
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

  const handleStartGame = async () => {
    if (Object.values(formation).filter(Boolean).length !== 7) {
      alert("Set Q1 lineup with 7 players before starting");
      return;
    }

    if (!lineupSaved[1]) {
      alert("Save Q1 lineup before starting the game");
      return;
    }

    setStarting(true);
    try {
      await startGame(gameId);
    } catch (err: any) {
      alert(err.message || "Failed to start game");
    }
    setStarting(false);
  };

  const handleEndGame = async () => {
    if (!confirm("Are you sure you want to end this game?")) return;

    setEnding(true);
    try {
      await endGame(gameId);
    } catch (err: any) {
      alert(err.message || "Failed to end game");
    }
    setEnding(false);
  };

  const handleSaveLineup = async () => {
    const playerIds = Object.values(formation).filter(Boolean) as number[];

    if (playerIds.length !== 7) {
      alert("Starting lineup must have exactly 7 players");
      return;
    }

    try {
      await saveStartingLineup(gameId, period, playerIds);
      setLineupSaved((prev) => ({ ...prev, [period]: true }));
    } catch (err: any) {
      alert(err.message || "Failed to save lineup");
    }
  };

  const handleSubstitution = async () => {
    if (!playerIn || !playerOut || !selectedPosition) return;

    const clockValue = minutes * 60 + seconds;

    try {
      await createSubstitution(gameId, {
        period,
        time: clockValue,
        playerInId: playerIn,
        playerOutId: playerOut,
      });

      setFormation((prev) => ({
        ...prev,
        [selectedPosition]: playerIn,
      }));
      setPlayerIn(null);
      setPlayerOut(null);
      setSelectedPosition(null);
    } catch (err) {
      alert("Failed to record substitution");
    }
  };

  const handlePeriodChange = (newPeriod: number) => {
    if (game.status !== "LIVE") {
      setPeriod(newPeriod);
      setMinutes(8);
      setSeconds(0);
      return;
    }
    if (!lineups[newPeriod] || lineups[newPeriod].length !== 7) {
      setPeriod(newPeriod);
      setMinutes(8);
      setSeconds(0);
      return;
    }

    setPeriod(newPeriod);
    setMinutes(8);
    setSeconds(0);
  };

  const handlePositionClick = (position: Position) => {
    const playerId = formation[position];

    if (playerId) {
      setSelectedPlayer(playerId);
      setSelectedPosition(position);
      setAssigningPosition(null);
    } else {
      setAssigningPosition(position);
      setSelectedPosition(position);
    }
  };

  const handleAssignPlayer = (playerId: number) => {
    if (!assigningPosition) return;

    const newFormation = { ...formation };
    for (const pos of Object.keys(newFormation) as Position[]) {
      if (newFormation[pos] === playerId) {
        newFormation[pos] = null;
      }
    }

    newFormation[assigningPosition] = playerId;
    setFormation(newFormation);
    setAssigningPosition(null);
    setSelectedPosition(null);
  };

  return (
    <div className="space-y-4">
      <ShotLocationModal
        key={showShotModal ? "open" : "closed"}
        isOpen={showShotModal}
        onClose={() => {
          setShowShotModal(false);
          setShotPlayer(null);
          setIsGoalShot(false);
        }}
        onSubmit={handleShotSubmit}
        scorer={shotPlayer!}
        roster={roster}
        isGoal={isGoalShot}
      />
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
                  } ${lineupSaved[p] ? "ring-2 ring-green-500" : ""}`}
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
                onChange={(e) =>
                  setMinutes(Math.max(0, Math.min(8, Number(e.target.value))))
                }
                className="w-16 h-12 bg-gray-700 border border-gray-600 rounded-lg text-center text-2xl font-mono font-bold"
              />
              <span className="text-2xl font-bold text-gray-400">:</span>
              <input
                type="number"
                min={0}
                max={59}
                value={seconds.toString().padStart(2, "0")}
                onChange={(e) =>
                  setSeconds(Math.max(0, Math.min(59, Number(e.target.value))))
                }
                className="w-16 h-12 bg-gray-700 border border-gray-600 rounded-lg text-center text-2xl font-mono font-bold"
              />
            </div>
            <div className="flex gap-1">
              {[8, 6, 4, 2, 0].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMinutes(m);
                    setSeconds(0);
                  }}
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
                activeTab === "stats"
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Stats
            </button>
            <button
              onClick={() => setActiveTab("subs")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "subs"
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Subs
            </button>
            <button
              onClick={() => setActiveTab("boxscore")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "boxscore"
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Box Score
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

      {game.status === "UPCOMING" && (
        <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-4 flex justify-between items-center">
          <div>
            <span className="text-blue-400 font-medium">Game not started</span>
            <p className="text-sm text-gray-400">
              Set Q1 lineup and save it to start the game
            </p>
          </div>
          <button
            onClick={handleStartGame}
            disabled={!lineupSaved[1] || starting}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {starting ? "Starting..." : "Start Game"}
          </button>
        </div>
      )}



      {game.status === "ENDED" && (
        <div className="bg-gray-500/20 border border-gray-500 rounded-xl p-4 flex justify-between items-center">
          <div>
            <span className="text-gray-400 font-medium">Game ended</span>
            <p className="text-sm text-gray-500">
              Final score: {game.teamScore} - {game.opponentScore}
            </p>
          </div>
          <span className="text-sm text-gray-500">
            Review mode — stats can be edited
          </span>
        </div>
      )}

      {activeTab === "stats" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4">
                {assigningPosition
                  ? `Select player for ${assigningPosition}`
                  : "Select Player"}
              </h2>

              <FormationView
                formation={formation}
                roster={roster}
                onPositionClick={handlePositionClick}
                selectedPosition={selectedPosition}
              />

              {assigningPosition && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h3 className="text-sm text-gray-400 mb-2">
                    Available Players
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {roster
                      .filter(
                        (r) => !Object.values(formation).includes(r.playerId),
                      )
                      .sort((a, b) => a.capNumber - b.capNumber)
                      .map((r) => (
                        <button
                          key={r.id}
                          onClick={() => handleAssignPlayer(r.playerId)}
                          className={`p-2 rounded-lg text-center transition-all ${
                            r.capNumber === 1 || r.capNumber === 13
                              ? "bg-red-900/40 border border-red-500 hover:bg-red-900/60"
                              : "bg-gray-700 hover:bg-gray-600"
                          }`}
                        >
                          <div
                            className={`text-lg font-bold ${
                              r.capNumber === 1 || r.capNumber === 13
                                ? "text-red-400"
                                : "text-white"
                            }`}
                          >
                            {r.capNumber}
                          </div>
                          <div className="text-xs text-gray-300 truncate">
                            {r.player.name.split(" ")[0]}
                          </div>
                        </button>
                      ))}
                  </div>
                  <button
                    onClick={() => {
                      setAssigningPosition(null);
                      setSelectedPosition(null);
                    }}
                    className="mt-2 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {!lineupSaved[period] &&
                Object.values(formation).filter(Boolean).length === 7 && (
                  <button
                    onClick={handleSaveLineup}
                    className="mt-4 w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
                  >
                    Save Q{period} Lineup to Start
                  </button>
                )}
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

              {!lineupSaved[period] && (
                <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-400 text-sm">
                  Save lineup for Q{period} before recording stats
                </div>
              )}

              {game.status === "ENDED" && (
                <div className="mb-4 p-3 bg-gray-500/20 border border-gray-500 rounded-lg text-gray-400 text-sm">
                  Reviewing game. You can add, edit, or delete stats.
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {eventTypes.map((event) => (
                  <button
                    key={event.key}
                    onClick={() =>
                      editingEvent
                        ? handleUpdateEvent(event.key)
                        : handleRecordEvent(event.key)
                    }
                    disabled={!selectedPlayer || recording || !canRecordStats}
                    className={`p-4 rounded-xl text-lg font-semibold transition-all ${event.color} ${
                      !selectedPlayer || recording || !canRecordStats
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
                  <p className="text-gray-500 text-center py-8">
                    No events yet
                  </p>
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
                <h2 className="text-lg font-semibold">
                  In Water ({Object.values(formation).filter(Boolean).length}/7)
                </h2>
                {Object.values(formation).filter(Boolean).length === 7 &&
                  !lineupSaved[period] && (
                    <button
                      onClick={handleSaveLineup}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm"
                    >
                      Save Q{period} Lineup
                    </button>
                  )}
                {lineupSaved[period] && (
                  <span className="text-green-400 text-sm">✓ Lineup Saved</span>
                )}
              </div>

              <FormationView
                formation={formation}
                roster={roster}
                onPositionClick={(position) => {
                  const playerId = formation[position];
                  if (playerId) {
                    setPlayerOut(playerId);
                    setSelectedPosition(position);
                  }
                }}
                selectedPosition={selectedPosition}
              />

              {Object.values(formation).filter(Boolean).length < 7 && (
                <p className="text-yellow-400 text-sm mt-4">
                  Tap empty positions to add players
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
                  .map((r) => {
                    const gk = isGoalkeeper(r.capNumber);
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          if (playerOut && selectedPosition) {
                            setPlayerIn(r.playerId);
                          } else if (
                            Object.values(formation).filter(Boolean).length < 7
                          ) {
                            setAssigningPosition(
                              (Object.keys(formation) as Position[]).find(
                                (pos) => !formation[pos],
                              ) || null,
                            );
                            handleAssignPlayer(r.playerId);
                          }
                        }}
                        className={`p-2 rounded-lg text-center ${
                          playerIn === r.playerId
                            ? "bg-green-600 ring-2 ring-green-400"
                            : gk
                              ? "bg-red-900/40 border border-red-500 hover:bg-red-900/60"
                              : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        <div
                          className={`text-2xl font-bold ${gk ? "text-red-400" : "text-white"}`}
                        >
                          {r.capNumber}
                        </div>
                        <div className="text-xs text-gray-300 truncate">
                          {r.player.name.split(" ")[0]}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
            {playerOut && playerIn && (
              <div className="bg-gray-800 rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-4">
                  Confirm Substitution
                </h2>
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
                    onClick={() => {
                      setPlayerIn(null);
                      setPlayerOut(null);
                      setSelectedPosition(null);
                    }}
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
                  <p className="text-gray-500 text-center py-4">
                    No substitutions yet
                  </p>
                ) : (
                  [...substitutions].reverse().map((sub) => (
                    <div
                      key={sub.id}
                      className="py-2 px-3 bg-gray-700/50 rounded-lg text-sm"
                    >
                      <span className="text-red-400">{sub.playerOut.name}</span>
                      <span className="text-gray-400 mx-2">→</span>
                      <span className="text-green-400">
                        {sub.playerIn.name}
                      </span>
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

      {activeTab === "boxscore" && (
        <BoxScore
          roster={roster}
          stats={stats}
          teamScore={game.teamScore}
          opponentScore={game.opponentScore}
          opponent={game.opponent}
          status={game.status}
        />
      )}
    </div>
  );
}
