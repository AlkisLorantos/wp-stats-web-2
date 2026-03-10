"use server";

import { api } from "@/lib/api/fetch";
import { PlayerWithStats } from "@/types";

export type TeamStats = {
  totals: {
    goals: number;
    assists: number;
    shots: number;
    steals: number;
    blocks: number;
    saves: number;
    exclusions: number;
    turnovers: number;
  };
  record: {
    wins: number;
    losses: number;
    draws: number;
    gamesPlayed: number;
    winPct: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDiff: number;
  };
  averages: {
    goalsPerGame: string;
    shotsPerGame: string;
    shootingPct: number;
  };
  topScorers: PlayerWithStats[];
  topAssisters: PlayerWithStats[];
  topShooters: (PlayerWithStats & { shootingPct: number })[];
  allPlayers: PlayerWithStats[];
};

export async function getTeamStats(): Promise<TeamStats> {
  return api("team-stats");
}