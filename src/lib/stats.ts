"use server";

import { api } from "@/lib/api/fetch";
import { revalidatePath } from "next/cache";

type StatEvent = {
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
  player: {
    id: number;
    name: string;
    capNumber?: number;
  };
};

export async function getGameStats(gameId: number): Promise<StatEvent[]> {
  return api(`games/${gameId}/stats`);
}

export async function createStat(gameId: number, formData: FormData) {
  const playerId = Number(formData.get("playerId"));
  const type = formData.get("type") as string;
  const context = formData.get("context") as string;
  const period = Number(formData.get("period")) || undefined;
  const clock = formData.get("clock") ? Number(formData.get("clock")) : undefined;

  if (!playerId || !type) {
    return { error: "Player and event type are required" };
  }

  try {
    await api(`games/${gameId}/stats`, "POST", {
      playerId,
      type,
      context: context || undefined,
      period,
      clock,
    });
    revalidatePath(`/games/${gameId}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to record stat" };
  }
}

export async function updateStat(
  gameId: number,
  statId: number,
  data: {
    playerId?: number;
    type?: string;
    context?: string;
    period?: number;
    clock?: number;
  }
) {
  try {
    await api(`games/${gameId}/stats/${statId}`, "PUT", data);
    revalidatePath(`/games/${gameId}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update stat" };
  }
}

export async function deleteStat(gameId: number, statId: number) {
  try {
    await api(`games/${gameId}/stats/${statId}`, "DELETE");
    revalidatePath(`/games/${gameId}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete stat" };
  }
}