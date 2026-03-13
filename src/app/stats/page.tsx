import { getTeamStats } from "@/lib/teamStats";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { EmptyState } from "@/components/ui/empty-state";

export default async function StatsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const stats = await getTeamStats();

  const hasNoData = stats.record.gamesPlayed === 0;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar username={user.username} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {hasNoData ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl">
            <EmptyState
              title="No stats yet"
              description="Add some games to see your team statistics here"
              action={{ label: "Schedule a Game", href: "/games" }}
            />
          </div>
        ) : (
          <>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Season Record</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.record.wins}</div>
                  <div className="text-sm text-gray-500">Wins</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red-600">{stats.record.losses}</div>
                  <div className="text-sm text-gray-500">Losses</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-gray-600">{stats.record.draws}</div>
                  <div className="text-sm text-gray-500">Draws</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.record.winPct}%</div>
                  <div className="text-sm text-gray-500">Win %</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-gray-900">{stats.record.gamesPlayed}</div>
                  <div className="text-sm text-gray-500">Games</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.record.goalsFor}</div>
                  <div className="text-sm text-gray-500">Goals For</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red-600">{stats.record.goalsAgainst}</div>
                  <div className="text-sm text-gray-500">Goals Against</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className={`text-3xl font-bold ${stats.record.goalDiff >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stats.record.goalDiff > 0 ? "+" : ""}{stats.record.goalDiff}
                  </div>
                  <div className="text-sm text-gray-500">Goal Diff</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Team Totals</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.totals.goals}</div>
                    <div className="text-sm text-gray-500">Goals</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.totals.assists}</div>
                    <div className="text-sm text-gray-500">Assists</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totals.shots}</div>
                    <div className="text-sm text-gray-500">Shots</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.totals.steals}</div>
                    <div className="text-sm text-gray-500">Steals</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.totals.blocks}</div>
                    <div className="text-sm text-gray-500">Blocks</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-cyan-600">{stats.totals.saves}</div>
                    <div className="text-sm text-gray-500">Saves</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.totals.exclusions}</div>
                    <div className="text-sm text-gray-500">Exclusions</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-600">{stats.totals.turnovers}</div>
                    <div className="text-sm text-gray-500">Turnovers</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Per Game Averages</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.averages.goalsPerGame}</div>
                    <div className="text-sm text-gray-500">Goals/Game</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.averages.shotsPerGame}</div>
                    <div className="text-sm text-gray-500">Shots/Game</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.averages.shootingPct}%</div>
                    <div className="text-sm text-gray-500">Shooting %</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Top Scorers</h2>
                {stats.topScorers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No goals scored yet</p>
                ) : (
                  <div className="space-y-2">
                    {stats.topScorers.map((player, index) => (
                      <Link
                        key={player.playerId}
                        href={`/players/${player.playerId}`}
                        className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? "bg-yellow-400 text-yellow-900" :
                            index === 1 ? "bg-gray-300 text-gray-700" :
                            index === 2 ? "bg-orange-400 text-orange-900" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {index + 1}
                          </span>
                          <span className="font-medium">{player.name}</span>
                        </div>
                        <span className="text-xl font-bold text-green-600">{player.goals}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Top Assisters</h2>
                {stats.topAssisters.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No assists recorded yet</p>
                ) : (
                  <div className="space-y-2">
                    {stats.topAssisters.map((player, index) => (
                      <Link
                        key={player.playerId}
                        href={`/players/${player.playerId}`}
                        className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? "bg-yellow-400 text-yellow-900" :
                            index === 1 ? "bg-gray-300 text-gray-700" :
                            index === 2 ? "bg-orange-400 text-orange-900" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {index + 1}
                          </span>
                          <span className="font-medium">{player.name}</span>
                        </div>
                        <span className="text-xl font-bold text-purple-600">{player.assists}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Best Shooting % <span className="text-sm font-normal text-gray-500">(min 5 shots)</span></h2>
                {stats.topShooters.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Not enough shots yet</p>
                ) : (
                  <div className="space-y-2">
                    {stats.topShooters.map((player, index) => (
                      <Link
                        key={player.playerId}
                        href={`/players/${player.playerId}`}
                        className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? "bg-yellow-400 text-yellow-900" :
                            index === 1 ? "bg-gray-300 text-gray-700" :
                            index === 2 ? "bg-orange-400 text-orange-900" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {index + 1}
                          </span>
                          <span className="font-medium">{player.name}</span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">{player.shootingPct}%</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">All Players</h2>
              {stats.allPlayers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No players yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-300">
                        <th className="text-left py-3 px-2">Player</th>
                        <th className="text-center py-3 px-2">G</th>
                        <th className="text-center py-3 px-2">A</th>
                        <th className="text-center py-3 px-2">S%</th>
                        <th className="text-center py-3 px-2">ST</th>
                        <th className="text-center py-3 px-2">BL</th>
                        <th className="text-center py-3 px-2">SV</th>
                        <th className="text-center py-3 px-2">EX</th>
                        <th className="text-center py-3 px-2">TO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.allPlayers
                        .sort((a, b) => b.goals - a.goals)
                        .map((player) => {
                          const shootingPct = player.shots > 0 
                            ? Math.round((player.goals / player.shots) * 100) 
                            : 0;
                          
                          return (
                            <tr key={player.playerId} className="border-b border-gray-200 hover:bg-gray-100">
                              <td className="py-3 px-2">
                                <Link href={`/players/${player.playerId}`} className="font-medium hover:text-blue-600">
                                  {player.name}
                                </Link>
                              </td>
                              <td className="text-center py-3 px-2 text-green-600 font-medium">
                                {player.goals || "-"}
                              </td>
                              <td className="text-center py-3 px-2 text-purple-600">
                                {player.assists || "-"}
                              </td>
                              <td className="text-center py-3 px-2 text-blue-600">
                                {player.shots > 0 ? `${shootingPct}%` : "-"}
                              </td>
                              <td className="text-center py-3 px-2 text-yellow-600">
                                {player.steals || "-"}
                              </td>
                              <td className="text-center py-3 px-2 text-orange-600">
                                {player.blocks || "-"}
                              </td>
                              <td className="text-center py-3 px-2 text-cyan-600">
                                {player.saves || "-"}
                              </td>
                              <td className="text-center py-3 px-2 text-red-600">
                                {player.exclusions || "-"}
                              </td>
                              <td className="text-center py-3 px-2 text-gray-600">
                                {player.turnovers || "-"}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500 flex flex-wrap gap-4">
                <span>G = Goals</span>
                <span>A = Assists</span>
                <span>S% = Shooting %</span>
                <span>ST = Steals</span>
                <span>BL = Blocks</span>
                <span>SV = Saves</span>
                <span>EX = Exclusions</span>
                <span>TO = Turnovers</span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}