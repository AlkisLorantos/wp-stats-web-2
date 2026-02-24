"use client";

import { useState } from "react";
import { addToRoster, removeFromRoster } from "@/lib/roster";
import { savePreset, deletePreset, loadPresetToGame } from "@/lib/rosterPreset";
import type { Player, RosterPlayer, RosterPreset } from "@/types";
import { isGoalkeeper } from "@/lib/utils";

type Props = {
  gameId: number;
  roster: RosterPlayer[];
  availablePlayers: Player[];
  presets: RosterPreset[];
};

export function RosterSetup({ gameId, roster, availablePlayers, presets }: Props) {
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const usedCapNumbers = roster.map((r) => r.capNumber);
  const availableCapNumbers = Array.from({ length: 14 }, (_, i) => i + 1).filter(
    (n) => !usedCapNumbers.includes(n)
  );

  const goalkeepers = roster.filter((r) => isGoalkeeper(r.capNumber));
  const fieldPlayers = roster.filter((r) => !isGoalkeeper(r.capNumber));

  const handleSavePreset = async () => {
    if (!presetName.trim() || roster.length === 0) return;

    setSaving(true);
    const rosterData = roster.map((r) => ({
      playerId: r.playerId,
      capNumber: r.capNumber,
    }));

    await savePreset(presetName.trim(), rosterData);
    setPresetName("");
    setShowSavePreset(false);
    setSaving(false);
  };

  const handleLoadPreset = async (presetId: number) => {
    if (roster.length > 0) {
      const confirm = window.confirm(
        "This will replace the current roster. Continue?"
      );
      if (!confirm) return;
    }

    setLoading(true);

    for (const r of roster) {
      await removeFromRoster(gameId, r.id);
    }

    await loadPresetToGame(gameId, presetId);
    setLoading(false);
  };

  const handleDeletePreset = async (presetId: number) => {
    const confirm = window.confirm("Delete this preset?");
    if (!confirm) return;

    await deletePreset(presetId);
  };

  const addToRosterWithId = addToRoster.bind(null, gameId);

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Roster Presets</h2>
          {roster.length > 0 && (
            <button
              onClick={() => setShowSavePreset(!showSavePreset)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium"
            >
              Save Current as Preset
            </button>
          )}
        </div>

        {showSavePreset && (
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Preset name (e.g., League Roster)"
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
            <button
              onClick={handleSavePreset}
              disabled={!presetName.trim() || saving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setShowSavePreset(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        )}

        {presets.length === 0 ? (
          <p className="text-gray-400 text-sm">No presets saved yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="bg-gray-700 rounded-lg p-3 flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{preset.name}</span>
                  <button
                    onClick={() => handleDeletePreset(preset.id)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-400 text-xs mb-2">
                  {preset.players.length} players
                </p>
                <button
                  onClick={() => handleLoadPreset(preset.id)}
                  disabled={loading}
                  className="mt-auto px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-2">Game Roster</h2>
        <p className="text-gray-400 text-sm mb-4">
          {roster.length}/14 players • {goalkeepers.length} goalkeeper
          {goalkeepers.length !== 1 ? "s" : ""}
        </p>

        {availablePlayers.length > 0 && availableCapNumbers.length > 0 && (
          <form action={addToRosterWithId} className="flex gap-3 mb-6">
            <select
              name="playerId"
              required
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="">Select player</option>
              {availablePlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              name="capNumber"
              required
              className="w-36 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="">Cap #</option>
              {availableCapNumbers.map((n) => (
                <option key={n} value={n}>
                  {n} {isGoalkeeper(n) ? "(GK)" : ""}
                </option>
              ))}
            </select>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Add
            </button>
          </form>
        )}

        {roster.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No players added yet. Load a preset or add players manually.
          </p>
        ) : (
          <div className="space-y-4">
            {goalkeepers.length > 0 && (
              <div>
                <h3 className="text-sm text-red-400 font-medium mb-2">Goalkeepers</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                  {goalkeepers
                    .sort((a, b) => a.capNumber - b.capNumber)
                    .map((r) => {
                      const removeWithIds = removeFromRoster.bind(null, gameId, r.id);
                      return (
                        <div
                          key={r.id}
                          className="bg-red-900/40 border border-red-500 rounded-lg p-4 text-center relative group"
                        >
                          <div className="text-3xl font-bold text-red-400 mb-1">
                            {r.capNumber}
                          </div>
                          <div className="text-sm text-gray-300 truncate">
                            {r.player.firstName}
                          </div>
                          <form
                            action={removeWithIds}
                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <button className="w-6 h-6 bg-red-500 rounded-full text-white text-xs hover:bg-red-600">
                              ×
                            </button>
                          </form>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {fieldPlayers.length > 0 && (
              <div>
                <h3 className="text-sm text-blue-400 font-medium mb-2">Field Players</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                  {fieldPlayers
                    .sort((a, b) => a.capNumber - b.capNumber)
                    .map((r) => {
                      const removeWithIds = removeFromRoster.bind(null, gameId, r.id);
                      return (
                        <div
                          key={r.id}
                          className="bg-gray-700 rounded-lg p-4 text-center relative group"
                        >
                          <div className="text-3xl font-bold text-white mb-1">
                            {r.capNumber}
                          </div>
                          <div className="text-sm text-gray-300 truncate">
                            {r.player.firstName}
                          </div>
                          <form
                            action={removeWithIds}
                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <button className="w-6 h-6 bg-red-500 rounded-full text-white text-xs hover:bg-red-600">
                              ×
                            </button>
                          </form>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {roster.length === 14 && (
          <p className="text-green-400 text-sm mt-4">✓ Full roster (14 players)</p>
        )}
      </div>
    </div>
  );
}