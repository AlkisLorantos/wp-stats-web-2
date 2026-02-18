import { getGames, createGame, deleteGame } from "@/lib/games";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function GamesPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const games = await getGames();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <h1 className="text-xl font-bold">Games</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <form action={createGame} className="mb-8 p-4 bg-white rounded-lg shadow">
          <h2 className="font-semibold mb-4">Schedule Game</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              name="opponent"
              placeholder="Opponent"
              required
              className="px-3 py-2 border rounded-md"
            />
            <input
              name="date"
              type="datetime-local"
              required
              className="px-3 py-2 border rounded-md"
            />
            <input
              name="location"
              placeholder="Location (optional)"
              className="px-3 py-2 border rounded-md"
            />
            <select name="homeOrAway" className="px-3 py-2 border rounded-md">
              <option value="">Home/Away</option>
              <option value="home">Home</option>
              <option value="away">Away</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>

        {games.length === 0 ? (
          <p className="text-gray-600">No games yet. Schedule your first game above.</p>
        ) : (
          <div className="space-y-4">
            {games.map((game) => (
              <div key={game.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                <div>
                  <div className="font-semibold">
                    vs {game.opponent}
                    <span className={`ml-2 text-xs px-2 py-1 rounded ${
                      game.status === "LIVE" ? "bg-green-100 text-green-800" :
                      game.status === "ENDED" ? "bg-gray-100 text-gray-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {game.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(game.date).toLocaleDateString()} • {game.location || "TBD"}
                  </div>
                  {game.status !== "UPCOMING" && (
                    <div className="text-lg font-bold mt-1">
                      {game.teamScore} - {game.opponentScore}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/games/${game.id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    {game.status === "LIVE" ? "Track" : "View"}
                  </Link>
                  <form action={async () => { "use server"; await deleteGame(game.id); }} className="inline">
                    <button type="submit" className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 text-sm">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}