"use server";

import { api } from "@/lib/api/fetch";
import { revalidatePath } from "next/cache";
import type { Player, PlayerStats } from "@/types/index";

export async function getPlayers(): Promise<Player[]> {
  return api("players");
}

export async function getPlayer(id: number): Promise<Player> {
  return api(`players/${id}`);
}

export async function createPlayer(formData: FormData): Promise<void> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const position = formData.get("position") as string;
  const capNumber = formData.get("capNumber") as string;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  }

  await api("players", "POST", { 
    firstName, 
    lastName, 
    position,
    capNumber: capNumber ? Number(capNumber) : undefined,
  });
  revalidatePath("/players");
}

export async function updatePlayer(id: number, data: { capNumber?: number | null; position?: string }): Promise<void> {
  await api(`players/${id}`, "PUT", data);
  revalidatePath("/players");
}

export async function deletePlayer(id: number): Promise<void> {
  await api(`players/${id}`, "DELETE");
  revalidatePath("/players");
}

export async function getPlayerStats(id: number): Promise<PlayerStats> {
  return api(`players/${id}/stats`);
}