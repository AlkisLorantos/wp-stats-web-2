import { getGame, startGame, endGame } from "@/lib/games";
import { getGameStats } from "@/lib/stats";
import { getGameRoster, addToRoster } from "@/lib/roster";
import { getPlayers } from "@/lib/players";
import { getUser } from "@/lib/auth";
import { getSubstitutions } from "@/lib/substitutions";
import { getStartingLineup } from "@/lib/lineup";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LiveTracker } from "@/components/live-tracker";
import { RosterSetup } from "@/components/roster-setup";

export default async function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const user = await getUser();
  if (!user) redirect("/login");

  const { gameId } = await params;
  const id = Number(gameId);

  const [game, stats, roster, allPlayers, substitutions] = await Promise.all([
    getGame(id),
    getGameStats(id),
    getGameRoster(id),
    getPlayers(),
    getSubstitutions(id),
  ]);

  const lineups: Record<number, number[]> = {};
  for (let period = 1; period <= 4; period++) {
    try {
      const lineup = await getStartingLineup(id, period);
      lineups[period] = lineup.map((l) => l.playerId);
    } catch {
      lineups[period] = [];
    }
  }

  const rosterPlayerIds = roster.map((r) => r.playerId);
  const availablePlayers = allPlayers.filter((p) => !rosterPlayerIds.includes(p.id));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/games" className="text-gray-400 hover:text-white">
              ← Back
            </Link>
            <h1 className="text-xl font-bold">vs {game.opponent}</h1>
            <span className={`text-xs px-2 py-1 rounded font-medium ${
              game.status === "LIVE" ? "bg-green-500 text-white" :
              game.status === "ENDED" ? "bg-gray-600 text-gray-300" :
              "bg-blue-500 text-white"
            }`}>
              {game.status}
            </span>
          </div>
          
          <div className="text-4xl font-bold tracking-wider">
            <span className="text-green-400">{game.teamScore}</span>
            <span className="text-gray-500 mx-2">-</span>
            <span className="text-red-400">{game.opponentScore}</span>
          </div>

          <div className="flex gap-2">
            {game.status === "UPCOMING" && (
              <form action={async () => { "use server"; await startGame(id); }}>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                  Start Game
                </button>
              </form>
            )}
            {game.status === "LIVE" && (
              <form action={async () => { "use server"; await endGame(id); }}>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                  End Game
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {game.status === "UPCOMING" && (
          <RosterSetup 
            gameId={id} 
            roster={roster} 
            availablePlayers={availablePlayers} 
          />
        )}

        {game.status === "LIVE" && roster.length > 0 && (
          <LiveTracker 
            gameId={id} 
            roster={roster} 
            stats={stats}
            substitutions={substitutions}
            lineups={lineups}
          />
        )}

        {game.status === "ENDED" && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Game Summary</h2>
              <div className="text-center text-6xl font-bold mb-6">
                <span className="text-green-400">{game.teamScore}</span>
                <span className="text-gray-500 mx-4">-</span>
                <span className="text-red-400">{game.opponentScore}</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Event Log</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {stats.map((stat) => (
                  <div key={stat.id} className="flex justify-between items-center py-2 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        stat.type === "GOAL" ? "bg-green-500/20 text-green-400" :
                        stat.type === "EXCLUSION" ? "bg-red-500/20 text-red-400" :
                        "bg-gray-700 text-gray-300"
                      }`}>
                        {stat.type}
                      </span>
                      <span>{stat.player.name}</span>
                    </div>
                    {stat.period && <span className="text-gray-500">P{stat.period}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {game.status === "LIVE" && roster.length === 0 && (
          <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-6 text-center">
            <p className="text-yellow-400">No players in roster. Add players before tracking stats.</p>
          </div>
        )}
      </main>
    </div>
  );
}