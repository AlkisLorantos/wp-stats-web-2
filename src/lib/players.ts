"use server";

import { api } from "@/lib/api/fetch";
import { revalidatePath } from "next/cache";

type Player = {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  position?: string;
  capNumber?: number;
};

export async function getPlayers(): Promise<Player[]> {
  return api("players");
}

export async function getPlayer(id: number): Promise<Player> {
  return api(`players/${id}`);
}

export async function createPlayer(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const position = formData.get("position") as string;

  if (!firstName || !lastName) {
    return { error: "First name and last name are required" };
  }

  try {
    await api("players", "POST", { firstName, lastName, position });
    revalidatePath("/players");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to create player" };
  }
}

export async function deletePlayer(id: number) {
  try {
    await api(`players/${id}`, "DELETE");
    revalidatePath("/players");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete player" };
  }
}