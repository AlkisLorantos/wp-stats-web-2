"use server";

import { api } from "@/lib/api/fetch";
import { revalidatePath } from "next/cache";

type RosterPlayer = {
  id: number;
  capNumber: number;
  playerId: number;
  player: {
    id: number;
    firstName: string;
    lastName: string;
    name: string;
  };
};

export async function getGameRoster(gameId: number): Promise<RosterPlayer[]> {
  return api(`games/${gameId}/roster`);
}

export async function addToRoster(gameId: number, formData: FormData) {
  const playerId = Number(formData.get("playerId"));
  const capNumber = Number(formData.get("capNumber"));

  if (!playerId || !capNumber) {
    return { error: "Player and cap number are required" };
  }

  try {
    await api(`games/${gameId}/roster`, "POST", {
      roster: [{ playerId, capNumber }],
    });
    revalidatePath(`/games/${gameId}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to add player to roster" };
  }
}

export async function removeFromRoster(gameId: number, rosterId: number) {
  try {
    await api(`games/${gameId}/roster/${rosterId}`, "DELETE");
    revalidatePath(`/games/${gameId}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to remove player" };
  }
}