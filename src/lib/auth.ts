"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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