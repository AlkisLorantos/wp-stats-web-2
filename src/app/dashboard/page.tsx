import { getUser } from "@/lib/auth";
import { getGames } from "@/lib/games";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const games = await getGames();

  const recentGames = games.slice(0, 5);
  const liveGames = games.filter((g) => g.status === "LIVE");
  const upcomingGames = games.filter((g) => g.status === "UPCOMING");

  return (
    <div className="min-h-screen bg-white text-gray-900">


      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="text-3xl font-bold text-orange-600">{liveGames.length}</div>
            <div className="text-sm text-gray-500">Live Now</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="text-3xl font-bold text-purple-600">{upcomingGames.length}</div>
            <div className="text-sm text-gray-500">Upcoming</div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/players"
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-1">Players</h3>
            <p className="text-sm text-gray-500">Manage your roster and view player stats</p>
          </Link>
          <Link
            href="/games"
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-1">Games</h3>
            <p className="text-sm text-gray-500">View and track games live</p>
          </Link>
          <Link
            href="/stats"
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-1">Stats</h3>
            <p className="text-sm text-gray-500">Analyze team performance</p>
          </Link>
        </div>

        {/* Live Games Alert */}
        {liveGames.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Games
            </h2>
            <div className="space-y-2">
              {liveGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="flex justify-between items-center p-3 bg-white border border-green-200 rounded-lg hover:shadow-sm"
                >
                  <span className="font-medium">vs {game.opponent}</span>
                  <span className="text-lg font-bold">
                    <span className="text-green-600">{game.teamScore}</span>
                    <span className="text-gray-400 mx-2">-</span>
                    <span className="text-red-600">{game.opponentScore}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Games */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Games</h2>
            <Link href="/games" className="text-blue-600 hover:text-blue-800 text-sm">
              View all →
            </Link>
          </div>
          
          {recentGames.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No games yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-300">
                    <th className="text-left py-2 px-2">Date</th>
                    <th className="text-left py-2 px-2">Opponent</th>
                    <th className="text-center py-2 px-2">Score</th>
                    <th className="text-center py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentGames.map((game) => (
                    <tr key={game.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-2 px-2 text-gray-500">
                        {new Date(game.date).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-2">
                        <Link href={`/games/${game.id}`} className="font-medium hover:text-blue-600">
                          vs {game.opponent}
                        </Link>
                      </td>
                      <td className="text-center py-2 px-2">
                        {game.status !== "UPCOMING" ? (
                          <span>
                            <span className="text-green-600 font-medium">{game.teamScore}</span>
                            <span className="text-gray-400 mx-1">-</span>
                            <span className="text-red-600 font-medium">{game.opponentScore}</span>
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="text-center py-2 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          game.status === "LIVE" 
                            ? "bg-green-100 text-green-700"
                            : game.status === "ENDED"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {game.status}
                        </span>
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