export type Player = {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  position?: string;
  capNumber?: number;
};

export type RosterPlayer = {
  id: number;
  capNumber: number;
  playerId: number;
  player: Player;
};

export type Game = {
  id: number;
  date: string;
  opponent: string;
  location?: string;
  homeOrAway?: string;
  status: "UPCOMING" | "LIVE" | "ENDED";
  teamScore: number;
  opponentScore: number;
};

export type StatEvent = {
  id: number;
  type: string;
  context?: string;
  shotOutcome?: string;
  period?: number;
  clock?: number;
  x?: number;
  y?: number;
  playerId: number;
  gameId: number;
  player: Player;
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
  players: {
    id: number;
    capNumber: number;
    playerId: number;
    player: Player;
  }[];
};

export type LineupPlayer = {
  id: number;
  playerId: number;
  player: Player;
};

export type AuthResult = {
  error?: string;
};