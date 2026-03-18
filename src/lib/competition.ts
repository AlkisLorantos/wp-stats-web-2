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

export async function createCompetition(formData: FormData): Promise<void> {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const season = formData.get("season") as string;

  if (!name) {
    throw new Error("Name is required");
  }

  await api("competitions", "POST", { name, type, season });
  revalidatePath("/competitions");
  revalidatePath("/games");
}

export async function deleteCompetition(id: number): Promise<void> {
  await api(`competitions/${id}`, "DELETE");
  revalidatePath("/competitions");
  revalidatePath("/games");
}