import { getCompetitions, createCompetition, deleteCompetition } from "@/lib/competition";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/app/components/navbar";
import { EmptyState } from "@/app/components/ui/empty-state";

export default async function CompetitionsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const competitions = await getCompetitions();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar username={user.username} />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Competitions</h1>
          <p className="text-gray-500 mt-1">{competitions.length} competitions</p>
        </div>

        <form action={createCompetition} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              name="name"
              placeholder="Name (e.g. A1 League)"
              required
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="type"
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Add Competition
            </button>
          </div>
        </form>

        {competitions.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl">
            <EmptyState
              title="No competitions yet"
              description="Add your first competition using the form above"
            />
          </div>
        ) : (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-500">
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium">Type</th>
                  <th className="py-3 px-4 font-medium">Season</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {competitions.map((comp) => (
                  <tr key={comp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium">{comp.name}</td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4 text-gray-500">{comp.season || "—"}</td>
                    <td className="py-3 px-4 text-right">
                      <form
                        action={async () => {
                          "use server";
                          await deleteCompetition(comp.id);
                        }}
                        className="inline"
                      >
                        <button
                          type="submit"
                          className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
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
      </main>
    </div>
  );
}