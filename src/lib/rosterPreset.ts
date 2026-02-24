"use server";

import { api } from "@/lib/api/fetch";
import { revalidatePath } from "next/cache";

type PresetPlayer = {
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

type RosterPreset = {
  id: number;
  name: string;
  players: PresetPlayer[];
};

export async function getPresets(): Promise<RosterPreset[]> {
  return api("roster-presets");
}

export async function getPreset(id: number): Promise<RosterPreset> {
  return api(`roster-presets/${id}`);
}

export async function savePreset(name: string, roster: { playerId: number; capNumber: number }[]) {
  try {
    await api("roster-presets", "POST", { name, roster });
    revalidatePath("/games");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to save preset" };
  }
}

export async function deletePreset(id: number) {
  try {
    await api(`roster-presets/${id}`, "DELETE");
    revalidatePath("/games");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete preset" };
  }
}

export async function loadPresetToGame(gameId: number, presetId: number) {
  const preset = await getPreset(presetId);
  
  for (const p of preset.players) {
    await api(`games/${gameId}/roster`, "POST", {
      playerId: p.playerId,
      capNumber: p.capNumber,
    });
  }
  
  revalidatePath(`/games/${gameId}`);
  return { success: true };
}