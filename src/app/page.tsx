import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Water Polo Stats
        </h1>
        <p className="text-gray-600 text-lg">
          Track detailed game statistics for your team. Create your team, add
          players, and start recording stats live.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}