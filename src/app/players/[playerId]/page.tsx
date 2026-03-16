import { getPlayer, getPlayerStats } from "@/lib/players";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { PlayerStats } from "@/types";
import { Navbar } from "@/components/navbar";
import { EmptyState } from "@/components/ui/empty-state";

export default async function PlayerPage({ params }: { params: Promise<{ playerId: string }> }) {
  const user = await getUser();
  if (!user) redirect("/login");

  const { playerId } = await params;
  const id = Number(playerId);

  const player = await getPlayer(id);
  const playerStats: PlayerStats = await getPlayerStats(id);

  const shootingPct = playerStats.shots > 0 
    ? Math.round((playerStats.goals / playerStats.shots) * 100) 
    : 0;

  const isGoalkeeper = player.capNumber === 1 || player.capNumber === 13;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar username={user.username} />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/players" className="text-gray-400 hover:text-gray-600">
            ← Back
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
            isGoalkeeper 
              ? "bg-red-100 text-red-700 border-2 border-red-300" 
              : player.capNumber 
                ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                : "bg-gray-100 text-gray-500 border-2 border-gray-200"
          }`}>
            {player.capNumber || "?"}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{player.name}</h1>
            <p className="text-gray-500">
              {player.position || "No position assigned"}
              {isGoalkeeper && <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">GK</span>}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Career Stats</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{playerStats.goals}</div>
              <div className="text-sm text-gray-500">Goals</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{playerStats.assists}</div>
              <div className="text-sm text-gray-500">Assists</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{shootingPct}%</div>
              <div className="text-sm text-gray-500">Shooting %</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{playerStats.steals}</div>
              <div className="text-sm text-gray-500">Steals</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{playerStats.blocks}</div>
              <div className="text-sm text-gray-500">Blocks</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-cyan-600">{playerStats.saves}</div>
              <div className="text-sm text-gray-500">Saves</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{playerStats.exclusions}</div>
              <div className="text-sm text-gray-500">Exclusions</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{playerStats.turnovers}</div>
              <div className="text-sm text-gray-500">Turnovers</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Game Log</h2>
          
          {player.games && player.games.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-300">
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Opponent</th>
                    <th className="text-center py-3 px-2">G</th>
                    <th className="text-center py-3 px-2">A</th>
                    <th className="text-center py-3 px-2">S%</th>
                    <th className="text-center py-3 px-2">ST</th>
                    <th className="text-center py-3 px-2">BL</th>
                    <th className="text-center py-3 px-2">SV</th>
                    <th className="text-center py-3 px-2">EX</th>
                  </tr>
                </thead>
                <tbody>
                  {player.games.map((game: any) => {
                    const gameShotPct = game.shots > 0 
                      ? Math.round((game.goals / game.shots) * 100) 
                      : 0;
                    
                    return (
                      <tr key={game.gameId} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-2 text-gray-500">
                          {new Date(game.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2">
                          <Link href={`/games/${game.gameId}`} className="font-medium hover:text-blue-600">
                            vs {game.opponent}
                          </Link>
                        </td>
                        <td className="text-center py-3 px-2 text-green-600 font-medium">
                          {game.goals || "-"}
                        </td>
                        <td className="text-center py-3 px-2 text-purple-600">
                          {game.assists || "-"}
                        </td>
                        <td className="text-center py-3 px-2 text-blue-600">
                          {game.shots > 0 ? `${gameShotPct}%` : "-"}
                        </td>
                        <td className="text-center py-3 px-2 text-yellow-600">
                          {game.steals || "-"}
                        </td>
                        <td className="text-center py-3 px-2 text-orange-600">
                          {game.blocks || "-"}
                        </td>
                        <td className="text-center py-3 px-2 text-cyan-600">
                          {game.saves || "-"}
                        </td>
                        <td className="text-center py-3 px-2 text-red-600">
                          {game.exclusions || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No games played yet"
              description="Stats will appear here after the player participates in a game"
            />
          )}
        </div>
      </main>
    </div>
  );
}