"use server";

import { api } from "@/lib/api/fetch";
import { revalidatePath } from "next/cache";
import type { RosterPlayer } from "@/types";

export async function getGameRoster(gameId: number): Promise<RosterPlayer[]> {
  return api(`games/${gameId}/roster`);
}

export async function addToRoster(gameId: number, formData: FormData): Promise<void> {
  const playerId = Number(formData.get("playerId"));
  const capNumber = Number(formData.get("capNumber"));

  if (!playerId || !capNumber) {
    throw new Error("Player and cap number are required");
  }

  await api(`games/${gameId}/roster`, "POST", { playerId, capNumber });
  revalidatePath(`/games/${gameId}`);
}

export async function removeFromRoster(gameId: number, rosterId: number): Promise<void> {
  await api(`games/${gameId}/roster/${rosterId}`, "DELETE");
  revalidatePath(`/games/${gameId}`);
}