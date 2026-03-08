"use server";

import { api } from "@/lib/api/fetch";

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
  topScorers: PlayerStat[];
  topAssisters: PlayerStat[];
  topShooters: (PlayerStat & { shootingPct: number })[];
  allPlayers: PlayerStat[];
};

export type PlayerStat = {
  playerId: number;
  name: string;
  goals: number;
  assists: number;
  shots: number;
  steals: number;
  blocks: number;
  saves: number;
  exclusions: number;
  turnovers: number;
};

export async function getTeamStats(): Promise<TeamStats> {
  return api("team-stats");
}