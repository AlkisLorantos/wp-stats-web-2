import { getPlayers, createPlayer, deletePlayer } from "@/lib/players";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PlayersPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const players = await getPlayers();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <h1 className="text-xl font-bold">Players</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <form action={createPlayer} className="mb-8 p-4 bg-white rounded-lg shadow">
          <h2 className="font-semibold mb-4">Add Player</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              name="firstName"
              placeholder="First name"
              required
              className="px-3 py-2 border rounded-md"
            />
            <input
              name="lastName"
              placeholder="Last name"
              required
              className="px-3 py-2 border rounded-md"
            />
            <input
              name="position"
              placeholder="Position (optional)"
              className="px-3 py-2 border rounded-md"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>

        {players.length === 0 ? (
          <p className="text-gray-600">No players yet. Add your first player above.</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Position</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id} className="border-t">
                    <td className="px-4 py-3">{player.name}</td>
                    <td className="px-4 py-3 text-gray-600">{player.position || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <form action={async () => { "use server"; await deletePlayer(player.id); }} className="inline">
                        <button type="submit" className="text-red-600 hover:underline text-sm">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}