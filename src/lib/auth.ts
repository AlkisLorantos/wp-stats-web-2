"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const API_URL = process.env.BACKEND_URL || "http://localhost:8000/api";

type AuthResult = { error?: string };

export async function login(
  _prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { error: err.message || "Invalid credentials" };
  }

  const setCookie = res.headers.get("set-cookie");
  const token = setCookie?.match(/token=([^;]+)/)?.[1];

  if (token) {
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  redirect("/dashboard");
}

export async function signup(
  _prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const teamName = formData.get("teamName") as string;

  if (!username || !password || !teamName) {
    return { error: "All fields are required" };
  }

  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, teamName }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { error: err.message || "Signup failed" };
  }

  const setCookie = res.headers.get("set-cookie");
  const token = setCookie?.match(/token=([^;]+)/)?.[1];

  if (token) {
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login");
}

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const payload = await res.json();
    return payload.data ?? payload;
  } catch {
    return null;
  }
}

// User/Account functions

export type UserInfo = {
  id: number;
  username: string;
  apiKey: string;
  team: {
    id: number;
    name: string;
  };
};

export async function getUserInfo(): Promise<UserInfo | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

export async function updateTeamName(name: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return { error: "Not authenticated" };

  try {
    const res = await fetch(`${API_URL}/auth/team`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to update team name" };
    }

    revalidatePath("/account");
    return { success: true };
  } catch {
    return { error: "Failed to update team name" };
  }
}

export async function regenerateApiKey() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return { error: "Not authenticated" };

  try {
    const res = await fetch(`${API_URL}/auth/regenerate-api-key`, {
      method: "POST",
      headers: { Cookie: `token=${token}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to regenerate API key" };
    }

    const data = await res.json();
    revalidatePath("/account");
    return { success: true, apiKey: data.apiKey };
  } catch {
    return { error: "Failed to regenerate API key" };
  }
}

export async function deleteAccount(confirmText: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return { error: "Not authenticated" };

  try {
    const res = await fetch(`${API_URL}/auth`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({ confirmText }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to delete account" };
    }

    const cookieStoreForDelete = await cookies();
    cookieStoreForDelete.delete("token");
    return { success: true };
  } catch {
    return { error: "Failed to delete account" };
  }
}

export async function exportData(type: "players" | "games" | "stats") {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return { error: "Not authenticated" };

  try {
    const res = await fetch(`${API_URL}/export/${type}`, {
      headers: { Cookie: `token=${token}` },
    });

    if (!res.ok) {
      return { error: "Failed to export data" };
    }

    const csv = await res.text();
    return { success: true, csv, filename: `${type}.csv` };
  } catch {
    return { error: "Failed to export data" };
  }
}