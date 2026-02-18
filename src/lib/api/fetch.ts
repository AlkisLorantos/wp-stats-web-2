import { cookies } from "next/headers";

const API_URL = process.env.BACKEND_URL || "http://localhost:8000/api";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function api<T>(
  route: string,
  method: Method = "GET",
  data?: object
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Cookie: `token=${token}` }),
    },
    cache: "no-store",
  };

  if (data && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${API_URL}/${route}`, options);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }

  const payload = await res.json();
  return payload.data != null ? payload.data : payload;
}