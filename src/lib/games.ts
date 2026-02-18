"use server";

import { api } from "@/lib/api/fetch";
import { revalidatePath } from "next/cache";

type Game = {
  id: number;
  date: string;
  opponent: string;
  location?: string;
  homeOrAway?: string;
  status: "UPCOMING" | "LIVE" | "ENDED";
  teamScore: number;
  opponentScore: number;
};

export async function getGames(): Promise<Game[]> {
  return api("games");
}

export async function getGame(id: number): Promise<Game> {
  return api(`games/${id}`);
}

export async function createGame(formData: FormData) {
  const opponent = formData.get("opponent") as string;
  const date = formData.get("date") as string;
  const location = formData.get("location") as string;
  const homeOrAway = formData.get("homeOrAway") as string;

  if (!opponent || !date) {
    return { error: "Opponent and date are required" };
  }

  try {
    await api("games", "POST", { opponent, date, location, homeOrAway });
    revalidatePath("/games");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to create game" };
  }
}

export async function deleteGame(id: number) {
  try {
    await api(`games/${id}`, "DELETE");
    revalidatePath("/games");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete game" };
  }
}

export async function startGame(id: number) {
  try {
    await api(`games/${id}/start`, "PATCH");
    revalidatePath("/games");
    revalidatePath(`/games/${id}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to start game" };
  }
}

export async function endGame(id: number) {
  try {
    await api(`games/${id}/end`, "PATCH");
    revalidatePath("/games");
    revalidatePath(`/games/${id}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to end game" };
  }
}