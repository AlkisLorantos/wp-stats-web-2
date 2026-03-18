import { getPlayers, createPlayer, deletePlayer, updatePlayer } from "@/lib/players";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { PlayerCapInput } from "@/components/player-cap-input";
import { PlayerPositionInput } from "@/components/player-position-input";
import { EmptyState } from "@/components/ui/empty-state";

async function updateCapNumber(playerId: number, capNumber: number | null) {
  "use server";
  await updatePlayer(playerId, { capNumber });
}

async function updatePosition(playerId: number, position: string | undefined) {
  "use server";
  await updatePlayer(playerId, { position });
}

export default async function PlayersPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const players = await getPlayers();

  const sortedPlayers = [...players].sort((a, b) => {
    if (a.capNumber && b.capNumber) return a.capNumber - b.capNumber;
    if (a.capNumber) return -1;
    if (b.capNumber) return 1;
    return a.name.localeCompare(b.name);
  });

  const assignedCount = players.filter((p) => p.capNumber).length;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar username={user.username} />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">Team Roster</h1>
            <p className="text-gray-500 mt-1">
              {players.length} players • {assignedCount} with cap numbers
            </p>
          </div>
        </div>

        <form action={createPlayer} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <div className="flex flex-wrap gap-3">
            <input
              name="firstName"
              placeholder="First name"
              required
              className="flex-1 min-w-[140px] px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              name="lastName"
              placeholder="Last name"
              required
              className="flex-1 min-w-[140px] px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              name="position"
              placeholder="Position"
              className="w-32 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              name="capNumber"
              type="number"
              min="1"
              max="99"
              placeholder="Cap #"
              className="w-20 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Add Player
            </button>
          </div>
        </form>

        {players.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl">
            <EmptyState
              title="No players yet"
              description="Add your first player using the form above to get started"
            />
          </div>
        ) : (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-500">
                  <th className="py-3 px-4 font-medium w-24">Cap #</th>
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium w-32">Position</th>
                  <th className="py-3 px-4 font-medium text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedPlayers.map((player) => {
                  const isGoalkeeper = player.capNumber === 1 || player.capNumber === 13;

                  return (
                    <tr
                      key={player.id}
                      className={`group hover:bg-gray-50 transition-colors ${
                        isGoalkeeper ? "bg-red-50/50" : ""
                      }`}
                    >
                      <td className="py-2 px-4">
                        <PlayerCapInput
                          playerId={player.id}
                          capNumber={player.capNumber ?? null}
                          isGoalkeeper={isGoalkeeper}
                          updateAction={updateCapNumber}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/players/${player.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {player.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <PlayerPositionInput
                          playerId={player.id}
                          position={player.position}
                          updateAction={updatePosition}
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/players/${player.id}`}
                            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            Stats
                          </Link>
                          <form
                            action={async () => {
                              "use server";
                              await deletePlayer(player.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {players.length > 0 && (
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-red-100 border-2 border-red-300"></span>
              <span>Goalkeeper (1, 13)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-blue-50 border-2 border-blue-300"></span>
              <span>Field player</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-gray-50 border-2 border-gray-200"></span>
              <span>Unassigned</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}