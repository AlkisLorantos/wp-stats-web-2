"use server";

import { api } from "@/lib/api/fetch";
import { revalidatePath } from "next/cache";
import type { RosterPreset } from "@/types";

export async function getPresets(): Promise<RosterPreset[]> {
  return api("roster-presets");
}

export async function getPreset(id: number): Promise<RosterPreset> {
  return api(`roster-presets/${id}`);
}

export async function savePreset(name: string, roster: { playerId: number; capNumber: number }[]): Promise<void> {
  await api("roster-presets", "POST", { name, roster });
  revalidatePath("/games");
}

export async function deletePreset(id: number): Promise<void> {
  await api(`roster-presets/${id}`, "DELETE");
  revalidatePath("/games");
}

export async function loadPresetToGame(gameId: number, presetId: number): Promise<void> {
  const preset = await getPreset(presetId);
  
  for (const p of preset.players) {
    await api(`games/${gameId}/roster`, "POST", {
      playerId: p.playerId,
      capNumber: p.capNumber,
    });
  }
  
  revalidatePath(`/games/${gameId}`);
}