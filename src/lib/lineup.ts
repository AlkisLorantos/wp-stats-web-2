"use server";

import { api } from "@/lib/api/fetch";
import { revalidatePath } from "next/cache";

type LineupPlayer = {
  id: number;
  playerId: number;
  player: {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
  };
};

export async function getStartingLineup(gameId: number, period: number): Promise<LineupPlayer[]> {
  return api(`games/${gameId}/starting-lineup/${period}`);
}

export async function saveStartingLineup(gameId: number, period: number, playerIds: number[]): Promise<void> {
  await api(`games/${gameId}/starting-lineup`, "POST", {
    period,
    lineup: playerIds.map((playerId) => ({ playerId })),
  });
  revalidatePath(`/games/${gameId}`);
}