"use server";

import { api } from "@/lib/api/fetch";
import { revalidatePath } from "next/cache";

type Substitution = {
  id: number;
  period: number;
  time: number;
  playerInId: number;
  playerOutId: number;
  playerIn: {
    id: number;
    name: string;
  };
  playerOut: {
    id: number;
    name: string;
  };
};

type PlayingTime = {
  playerId: number;
  gameId: number;
  playingTime: number;
};

export async function getSubstitutions(gameId: number): Promise<Substitution[]> {
  return api(`games/${gameId}/substitutions`);
}

export async function createSubstitution(
  gameId: number,
  data: {
    period: number;
    time: number;
    playerInId: number;
    playerOutId: number;
  }
) {
  try {
    await api(`games/${gameId}/substitutions`, "POST", data);
    revalidatePath(`/games/${gameId}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to record substitution" };
  }
}

export async function getPlayerPlayingTime(gameId: number, playerId: number): Promise<PlayingTime> {
  return api(`games/${gameId}/players/${playerId}/playing-time`);
}

export async function getAllPlayersPlayingTime(gameId: number, playerIds: number[]): Promise<Map<number, number>> {
  const times = new Map<number, number>();
  await Promise.all(
    playerIds.map(async (playerId) => {
      try {
        const result = await getPlayerPlayingTime(gameId, playerId);
        times.set(playerId, result.playingTime);
      } catch {
        times.set(playerId, 0);
      }
    })
  );
  return times;
}