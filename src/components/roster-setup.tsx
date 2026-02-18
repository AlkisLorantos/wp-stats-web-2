import { addToRoster, removeFromRoster } from "@/lib/roster";

type Player = {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
};

type RosterPlayer = {
  id: number;
  capNumber: number;
  playerId: number;
  player: Player;
};

type Props = {
  gameId: number;
  roster: RosterPlayer[];
  availablePlayers: Player[];
};

export function RosterSetup({ gameId, roster, availablePlayers }: Props) {
  const addToRosterWithId = addToRoster.bind(null, gameId);
  
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Game Roster</h2>

      {availablePlayers.length > 0 && (
        <form action={addToRosterWithId} className="flex gap-3 mb-6">
          <select
            name="playerId"
            required
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="">Select player</option>
            {availablePlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            name="capNumber"
            type="number"
            min="1"
            max="99"
            placeholder="Cap #"
            required
            className="w-24 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center"
          />
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Add
          </button>
        </form>
      )}

      {roster.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No players added yet.</p>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {roster
            .sort((a, b) => a.capNumber - b.capNumber)
            .map((r) => {
              const removeWithIds = removeFromRoster.bind(null, gameId, r.id);
              return (
                <div
                  key={r.id}
                  className="bg-gray-700 rounded-lg p-4 text-center relative group"
                >
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    {r.capNumber}
                  </div>
                  <div className="text-sm text-gray-300 truncate">
                    {r.player.firstName}
                  </div>
                  <form
                    action={removeWithIds}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <button className="w-6 h-6 bg-red-500 rounded-full text-white text-xs hover:bg-red-600">
                      ×
                    </button>
                  </form>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}