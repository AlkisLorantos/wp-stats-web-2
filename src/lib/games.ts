"use server";

import { api } from "@/lib/api/fetch";
import { revalidatePath } from "next/cache";
import type { Game } from "@/types";

export async function getGames(): Promise<Game[]> {
  return api("games");
}

export async function getGame(id: number): Promise<Game> {
  return api(`games/${id}`);
}

export async function createGame(formData: FormData): Promise<void> {
  const opponent = formData.get("opponent") as string;
  const date = formData.get("date") as string;
  const location = formData.get("location") as string;
  const homeOrAway = formData.get("homeOrAway") as string;
  const competitionId = formData.get("competitionId") as string;

  if (!opponent || !date) {
    throw new Error("Opponent and date are required");
  }

  await api("games", "POST", { 
    opponent, 
    date, 
    location: location || null, 
    homeOrAway: homeOrAway || null,
    competitionId: competitionId ? Number(competitionId) : null,
  });
  revalidatePath("/games");
  revalidatePath("/dashboard");
}

export async function deleteGame(id: number): Promise<void> {
  await api(`games/${id}`, "DELETE");
  revalidatePath("/games");
  revalidatePath("/dashboard");
}

export async function startGame(id: number): Promise<void> {
  await api(`games/${id}/start`, "PATCH");
  revalidatePath("/games");
  revalidatePath(`/games/${id}`);
}

export async function endGame(id: number): Promise<void> {
  await api(`games/${id}/end`, "PATCH");
  revalidatePath("/games");
  revalidatePath(`/games/${id}`);
}