import { getGames, createGame, deleteGame } from "@/lib/games";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function GamesPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const games = await getGames();

  const upcomingGames = games.filter((g) => g.status === "UPCOMING");
  const liveGames = games.filter((g) => g.status === "LIVE");
  const endedGames = games.filter((g) => g.status === "ENDED");

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
              ← Back
            </Link>
            <h1 className="text-2xl font-bold">Games</h1>
          </div>
          <span className="text-gray-500">{games.length} games</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Schedule Game Form */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Schedule Game</h2>
          <form action={createGame}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                name="opponent"
                placeholder="Opponent"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="date"
                type="datetime-local"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="location"
                placeholder="Location (optional)"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="homeOrAway"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Home/Away</option>
                <option value="home">Home</option>
                <option value="away">Away</option>
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Add Game
              </button>
            </div>
          </form>
        </div>

        {/* Live Games */}
        {liveGames.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Now
            </h2>
            <div className="space-y-3">
              {liveGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-white border border-green-200 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold text-lg">vs {game.opponent}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(game.date).toLocaleDateString()} • {game.location || "TBD"}
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      <span className="text-green-600">{game.teamScore}</span>
                      <span className="text-gray-400 mx-2">-</span>
                      <span className="text-red-600">{game.opponentScore}</span>
                    </div>
                  </div>
                  <Link
                    href={`/games/${game.id}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Track Game
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Games */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming</h2>

          {upcomingGames.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No upcoming games</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-300">
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Opponent</th>
                    <th className="text-left py-3 px-2">Location</th>
                    <th className="text-center py-3 px-2">Home/Away</th>
                    <th className="text-right py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingGames.map((game) => (
                    <tr key={game.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-2 text-gray-500">
                        {new Date(game.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        <Link href={`/games/${game.id}`} className="font-medium hover:text-blue-600">
                          vs {game.opponent}
                        </Link>
                      </td>
                      <td className="py-3 px-2 text-gray-500">{game.location || "TBD"}</td>
                      <td className="text-center py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          game.homeOrAway === "home"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        }`}>
                          {game.homeOrAway === "home" ? "Home" : "Away"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right space-x-4">
                        <Link
                          href={`/games/${game.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Setup
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteGame(game.id);
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

        {/* Past Games */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Past Games</h2>

          {endedGames.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No past games yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-300">
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Opponent</th>
                    <th className="text-center py-3 px-2">Score</th>
                    <th className="text-center py-3 px-2">Result</th>
                    <th className="text-right py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {endedGames.map((game) => {
                    const won = game.teamScore > game.opponentScore;
                    const lost = game.teamScore < game.opponentScore;
                    const draw = game.teamScore === game.opponentScore;

                    return (
                      <tr key={game.id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-2 text-gray-500">
                          {new Date(game.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2">
                          <Link href={`/games/${game.id}`} className="font-medium hover:text-blue-600">
                            vs {game.opponent}
                          </Link>
                        </td>
                        <td className="text-center py-3 px-2">
                          <span className="text-green-600 font-medium">{game.teamScore}</span>
                          <span className="text-gray-400 mx-1">-</span>
                          <span className="text-red-600 font-medium">{game.opponentScore}</span>
                        </td>
                        <td className="text-center py-3 px-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            won
                              ? "bg-green-100 text-green-700"
                              : lost
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                          }`}>
                            {won ? "W" : lost ? "L" : "D"}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right space-x-4">
                          <Link
                            href={`/games/${game.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View Stats
                          </Link>
                          <form
                            action={async () => {
                              "use server";
                              await deleteGame(game.id);
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}