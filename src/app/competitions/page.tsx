import { getCompetitions, createCompetition, deleteCompetition } from "@/lib/competitions";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CompetitionsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const competitions = await getCompetitions();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
              ← Back
            </Link>
            <h1 className="text-2xl font-bold">Competitions</h1>
          </div>
          <span className="text-gray-500">{competitions.length} competitions</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Add Competition</h2>
          <form action={createCompetition}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                name="name"
                placeholder="Name (e.g. A1 League)"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="type"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Type (optional)</option>
                <option value="league">League</option>
                <option value="cup">Cup</option>
                <option value="tournament">Tournament</option>
                <option value="friendly">Friendly</option>
              </select>
              <input
                name="season"
                placeholder="Season (e.g. 2024-25)"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Add Competition
              </button>
            </div>
          </form>
        </div>

        {/* Competitions List */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">All Competitions</h2>

          {competitions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No competitions yet. Add your first competition above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-300">
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-left py-3 px-2">Type</th>
                    <th className="text-left py-3 px-2">Season</th>
                    <th className="text-right py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {competitions.map((comp) => (
                    <tr key={comp.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-2 font-medium">{comp.name}</td>
                      <td className="py-3 px-2">
                        {comp.type ? (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            comp.type === "league"
                              ? "bg-blue-100 text-blue-700"
                              : comp.type === "cup"
                                ? "bg-yellow-100 text-yellow-700"
                                : comp.type === "tournament"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}>
                            {comp.type}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-500">{comp.season || "—"}</td>
                      <td className="py-3 px-2 text-right">
                        <form
                          action={async () => {
                            "use server";
                            await deleteCompetition(comp.id);
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