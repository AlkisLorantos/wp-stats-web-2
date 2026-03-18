export type Player = {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  position: string | null;
  capNumber: number | null;
  totals: PlayerStats | null;
  games: PlayerGameStats[] | null;
};

export type PlayerGameStats = {
  gameId: number;
  date: string;
  opponent: string;
  goals: number;
  assists: number;
  shots: number;
  steals: number;
  blocks: number;
  saves: number;
  exclusions: number;
};

export type RosterPlayer = {
  id: number;
  capNumber: number;
  playerId: number;
  player: {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    capNumber: number | null;
  };
};

export type Game = {
  id: number;
  date: string;
  opponent: string;
  location: string | null;
  homeOrAway: string | null;
  status: "UPCOMING" | "LIVE" | "ENDED";
  teamScore: number;
  opponentScore: number;
  competition: Competition | null;
};

export type Competition = {
  id: number;
  name: string;
  type: string | null;
  season: string | null;
};

export type StatEvent = {
  id: number;
  type: string;
  context: string | null;
  shotOutcome: string | null;
  period: number | null;
  clock: number | null;
  x: number | null;
  y: number | null;
  goalX: number | null;
  goalY: number | null;
  playerId: number;
  gameId: number;
  assistEventId: number | null;
  player: {
    id: number;
    name: string;
    capNumber: number | null;
  };
};

export type PlayerStats = {
  goals: number;
  assists: number;
  shots: number;
  steals: number;
  blocks: number;
  saves: number;
  exclusions: number;
  turnovers: number;
};

export type PlayerWithStats = PlayerStats & {
  playerId: number;
  name: string;
};

export type Substitution = {
  id: number;
  period: number;
  time: number;
  playerInId: number;
  playerOutId: number;
  playerIn: { id: number; name: string };
  playerOut: { id: number; name: string };
};

export type RosterPreset = {
  id: number;
  name: string;
  players: RosterPlayer[];
};

export type LineupPlayer = {
  id: number;
  playerId: number;
  player: {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
  };
};

export type AuthResult = {
  error?: string;
};

export type ShotOutcome = "GOAL" | "SAVED" | "MISSED" | "BLOCKED" | "POST";

export type ShotLocationData = {
  poolX: number;
  poolY: number;
  goalX: number;
  goalY: number;
  outcome: ShotOutcome;
  assisterId: number | null;
};

export type Position = "GK" | "LW" | "RW" | "LD" | "RD" | "CB" | "C";

export type Formation = {
  [key in Position]: number | null;
};