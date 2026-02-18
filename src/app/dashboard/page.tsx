import { getUser, logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">WP Stats</h1>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Welcome back</h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/players"
            className="p-6 bg-white rounded-lg shadow hover:shadow-md"
          >
            <h3 className="font-semibold">Players</h3>
            <p className="text-sm text-gray-600">Manage your roster</p>
          </Link>
          <Link
            href="/games"
            className="p-6 bg-white rounded-lg shadow hover:shadow-md"
          >
            <h3 className="font-semibold">Games</h3>
            <p className="text-sm text-gray-600">View and track games</p>
          </Link>
          <Link
            href="/stats"
            className="p-6 bg-white rounded-lg shadow hover:shadow-md"
          >
            <h3 className="font-semibold">Stats</h3>
            <p className="text-sm text-gray-600">Analyze performance</p>
          </Link>
        </div>
      </main>
    </div>
  );
}