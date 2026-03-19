"use client";

import type { RosterPlayer, StatEvent } from "@/types";
import { isGoalkeeper } from "@/lib/utils";

type Props = {
  roster: RosterPlayer[];
  stats: StatEvent[];
  teamScore: number;
  opponentScore: number;
  opponent: string;
  status: "UPCOMING" | "LIVE" | "ENDED";
};

type PlayerStats = {
  playerId: number;
  capNumber: number;
  name: string;
  isGK: boolean;
  goals: number;
  assists: number;
  shots: number;
  steals: number;
  blocks: number;
  saves: number;
  exclusions: number;
  turnovers: number;
};

export function BoxScore({ roster, stats, teamScore, opponentScore, opponent, status }: Props) {

  const playerStats: PlayerStats[] = roster
    .sort((a, b) => a.capNumber - b.capNumber)
    .map((r) => {
      const playerEvents = stats.filter((s) => s.playerId === r.playerId);
      const gk = isGoalkeeper(r.capNumber);

      return {
        playerId: r.playerId,
        capNumber: r.capNumber,
        name: r.player.name,
        isGK: gk,
        goals: playerEvents.filter((e) => e.type === "GOAL").length,
        assists: playerEvents.filter((e) => e.type === "ASSIST").length,
        shots: playerEvents.filter((e) => e.type === "SHOT" || e.type === "GOAL").length,
        steals: playerEvents.filter((e) => e.type === "STEAL").length,
        blocks: playerEvents.filter((e) => e.type === "BLOCK").length,
        saves: playerEvents.filter((e) => e.type === "SAVE").length,
        exclusions: playerEvents.filter((e) => e.type === "EXCLUSION").length,
        turnovers: playerEvents.filter((e) => e.type === "TURNOVER").length,
      };
    });

  const getShootingPercentage = (goals: number, shots: number) => {
    if (shots === 0) return "-";
    return `${Math.round((goals / shots) * 100)}%`;
  };

  const totals = playerStats.reduce(
    (acc, p) => ({
      goals: acc.goals + p.goals,
      assists: acc.assists + p.assists,
      shots: acc.shots + p.shots,
      steals: acc.steals + p.steals,
      blocks: acc.blocks + p.blocks,
      saves: acc.saves + p.saves,
      exclusions: acc.exclusions + p.exclusions,
      turnovers: acc.turnovers + p.turnovers,
    }),
    { goals: 0, assists: 0, shots: 0, steals: 0, blocks: 0, saves: 0, exclusions: 0, turnovers: 0 }
  );

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          vs {opponent}
          {status === "LIVE" && (
            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded animate-pulse">
              LIVE
            </span>
          )}
        </h2>
        <div className="text-3xl font-bold">
          <span className="text-green-400">{teamScore}</span>
          <span className="text-gray-500 mx-2">-</span>
          <span className="text-red-400">{opponentScore}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2 px-2">#</th>
              <th className="text-left py-2 px-2">Player</th>
              <th className="text-center py-2 px-2">G</th>
              <th className="text-center py-2 px-2">A</th>
              <th className="text-center py-2 px-2">S%</th>
              <th className="text-center py-2 px-2">ST</th>
              <th className="text-center py-2 px-2">BL</th>
              <th className="text-center py-2 px-2">SV</th>
              <th className="text-center py-2 px-2">EX</th>
              <th className="text-center py-2 px-2">TO</th>
            </tr>
          </thead>
          <tbody>
            {playerStats.map((p) => (
              <tr
                key={p.playerId}
                className={`border-b border-gray-700/50 ${
                  p.isGK ? "bg-red-900/20" : ""
                }`}
              >
                <td className={`py-2 px-2 font-bold ${p.isGK ? "text-red-400" : "text-white"}`}>
                  {p.capNumber}
                </td>
                <td className="py-2 px-2">{p.name}</td>
                <td className="text-center py-2 px-2 text-green-400 font-medium">
                  {p.goals || "-"}
                </td>
                <td className="text-center py-2 px-2 text-purple-400">
                  {p.assists || "-"}
                </td>
                <td className="text-center py-2 px-2 text-blue-400">
                  {getShootingPercentage(p.goals, p.shots)}
                </td>
                <td className="text-center py-2 px-2 text-yellow-400">
                  {p.steals || "-"}
                </td>
                <td className="text-center py-2 px-2 text-orange-400">
                  {p.isGK ? "-" : p.blocks || "-"}
                </td>
                <td className="text-center py-2 px-2 text-cyan-400">
                  {p.isGK ? p.saves || "-" : "-"}
                </td>
                <td className="text-center py-2 px-2 text-red-400">
                  {p.exclusions || "-"}
                </td>
                <td className="text-center py-2 px-2 text-gray-400">
                  {p.turnovers || "-"}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-700/50 font-medium">
              <td className="py-2 px-2"></td>
              <td className="py-2 px-2">TOTAL</td>
              <td className="text-center py-2 px-2 text-green-400">{totals.goals}</td>
              <td className="text-center py-2 px-2 text-purple-400">{totals.assists}</td>
              <td className="text-center py-2 px-2 text-blue-400">
                {getShootingPercentage(totals.goals, totals.shots)}
              </td>
              <td className="text-center py-2 px-2 text-yellow-400">{totals.steals}</td>
              <td className="text-center py-2 px-2 text-orange-400">{totals.blocks}</td>
              <td className="text-center py-2 px-2 text-cyan-400">{totals.saves}</td>
              <td className="text-center py-2 px-2 text-red-400">{totals.exclusions}</td>
              <td className="text-center py-2 px-2 text-gray-400">{totals.turnovers}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500 flex flex-wrap gap-4">
        <span>G = Goals</span>
        <span>A = Assists</span>
        <span>S% = Shooting %</span>
        <span>ST = Steals</span>
        <span>BL = Blocks</span>
        <span>SV = Saves</span>
        <span>EX = Exclusions</span>
        <span>TO = Turnovers</span>
      </div>
    </div>
  );
}