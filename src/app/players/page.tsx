import { getPlayers, createPlayer, deletePlayer } from "@/lib/players";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PlayersPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const players = await getPlayers();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
              ← Back
            </Link>
            <h1 className="text-2xl font-bold">Players</h1>
          </div>
          <span className="text-gray-500">{players.length} players</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Add Player Form */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Add Player</h2>
          <form action={createPlayer}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                name="firstName"
                placeholder="First name"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="lastName"
                placeholder="Last name"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="position"
                placeholder="Position (optional)"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Add Player
              </button>
            </div>
          </form>
        </div>

        {/* Players List */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Roster</h2>
          
          {players.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No players yet. Add your first player above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-300">
                    <th className="text-left py-3 px-2">#</th>
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-left py-3 px-2">Position</th>
                    <th className="text-right py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-2 text-gray-500">
                        {player.capNumber || "-"}
                      </td>
                      <td className="py-3 px-2">
                        <Link href={`/players/${player.id}`} className="font-medium hover:text-blue-600">
                          {player.name}
                        </Link>
                      </td>
                      <td className="py-3 px-2 text-gray-500">
                        {player.position || "-"}
                      </td>
                      <td className="py-3 px-2 text-right space-x-4">
                        <Link
                          href={`/players/${player.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Stats
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deletePlayer(player.id);
                          }}
                          className="inline"
                        >
                          <button
                            type="submit"
                            className="text-red-500 hover:text-red-700"
                          >
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
        </div>
      </main>
    </div>
  );
}