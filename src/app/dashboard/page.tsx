import { getUser } from "@/lib/auth";
import { getGames } from "@/lib/games";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/app/components/navbar";
import { EmptyState } from "@/app/components/ui/empty-state";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const games = await getGames();

  const liveGames = games.filter((g) => g.status === "LIVE");
  const upcomingGames = games.filter((g) => g.status === "UPCOMING").slice(0, 3);
  const recentGames = games.filter((g) => g.status === "ENDED").slice(0, 5);

  const hasNoGames = games.length === 0;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar username={user.username} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {hasNoGames && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
            <EmptyState
              title={`Welcome, ${user.username}!`}
              description="Get started by adding your players and scheduling your first game."
              action={{ label: "Add Players", href: "/players" }}
            />
          </div>
        )}

        {liveGames.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Now
            </h2>
            <div className="space-y-2">
              {liveGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="flex justify-between items-center p-4 bg-white border border-green-200 rounded-lg hover:shadow-sm"
                >
                  <div>
                    <span className="font-semibold">vs {game.opponent}</span>
                    {game.competition && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        {game.competition.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold">
                      <span className="text-green-600">{game.teamScore}</span>
                      <span className="text-gray-400 mx-2">-</span>
                      <span className="text-red-600">{game.opponentScore}</span>
                    </span>
                    <span className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium">
                      Track
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!hasNoGames && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Upcoming Games</h2>
                <Link href="/games" className="text-blue-600 hover:text-blue-800 text-sm">
                  View all →
                </Link>
              </div>

              {upcomingGames.length === 0 ? (
                <EmptyState
                  title="No upcoming games"
                  description="Schedule a game to get started"
                  action={{ label: "Schedule Game", href: "/games" }}
                />
              ) : (
                <div className="space-y-3">
                  {upcomingGames.map((game) => (
                    <Link
                      key={game.id}
                      href={`/games/${game.id}`}
                      className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm"
                    >
                      <div>
                        <div className="font-medium">vs {game.opponent}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(game.date).toLocaleDateString()}
                          {game.competition && (
                            <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                              {game.competition.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        game.homeOrAway === "home"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {game.homeOrAway === "home" ? "Home" : "Away"}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Results</h2>
                <Link href="/games" className="text-blue-600 hover:text-blue-800 text-sm">
                  View all →
                </Link>
              </div>

              {recentGames.length === 0 ? (
                <EmptyState
                  title="No recent games"
                  description="Completed games will appear here"
                />
              ) : (
                <div className="space-y-3">
                  {recentGames.map((game) => {
                    const won = game.teamScore > game.opponentScore;
                    const lost = game.teamScore < game.opponentScore;

                    return (
                      <Link
                        key={game.id}
                        href={`/games/${game.id}`}
                        className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm"
                      >
                        <div>
                          <div className="font-medium">vs {game.opponent}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(game.date).toLocaleDateString()}
                            {game.competition && (
                              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                {game.competition.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold">
                            <span className="text-green-600">{game.teamScore}</span>
                            <span className="text-gray-400 mx-1">-</span>
                            <span className="text-red-600">{game.opponentScore}</span>
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            won
                              ? "bg-green-100 text-green-700"
                              : lost
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                          }`}>
                            {won ? "W" : lost ? "L" : "D"}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}