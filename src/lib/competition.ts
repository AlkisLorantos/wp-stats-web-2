"use server";

import { api } from "@/lib/api/fetch";
import { revalidatePath } from "next/cache";

export type Competition = {
  id: number;
  name: string;
  type?: string;
  season?: string;
};

export async function getCompetitions(): Promise<Competition[]> {
  return api("competitions");
}

export async function getCompetition(id: number): Promise<Competition> {
  return api(`competitions/${id}`);
}

export async function createCompetition(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const season = formData.get("season") as string;

  if (!name) {
    return { error: "Name is required" };
  }

  try {
    await api("competitions", "POST", { name, type, season });
    revalidatePath("/competitions");
    revalidatePath("/games");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to create competition" };
  }
}

export async function deleteCompetition(id: number) {
  try {
    await api(`competitions/${id}`, "DELETE");
    revalidatePath("/competitions");
    revalidatePath("/games");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete competition" };
  }
}