"use server";

import { api } from "@/lib/api/fetch";
import { revalidatePath } from "next/cache";
import type { StatEvent } from "@/types";

export async function getGameStats(gameId: number): Promise<StatEvent[]> {
  return api(`games/${gameId}/stats`);
}

export async function createStat(gameId: number, formData: FormData): Promise<void> {
  const playerId = Number(formData.get("playerId"));
  const type = formData.get("type") as string;
  const context = formData.get("context") as string;
  const period = Number(formData.get("period")) || undefined;
  const clock = formData.get("clock") ? Number(formData.get("clock")) : undefined;

  if (!playerId || !type) {
    throw new Error("Player and event type are required");
  }

  await api(`games/${gameId}/stats`, "POST", {
    playerId,
    type,
    context: context || null,
    period: period || null,
    clock: clock || null,
  });
  revalidatePath(`/games/${gameId}`);
}

export async function createShotWithLocation(
  gameId: number,
  data: {
    playerId: number;
    x: number;
    y: number;
    goalX: number;
    goalY: number;
    shotOutcome: string;
    assisterId?: number;
    period: number;
    clock: number;
    context?: string;
  }
): Promise<void> {
  await api(`games/${gameId}/stats/shot`, "POST", data);
  revalidatePath(`/games/${gameId}`);
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
): Promise<void> {
  await api(`games/${gameId}/stats/${statId}`, "PUT", data);
  revalidatePath(`/games/${gameId}`);
}

export async function deleteStat(gameId: number, statId: number): Promise<void> {
  await api(`games/${gameId}/stats/${statId}`, "DELETE");
  revalidatePath(`/games/${gameId}`);
}