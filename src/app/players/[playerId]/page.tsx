import { getPlayer, getPlayerStats } from "@/lib/players";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";



export default async function PlayerPage({ params }: { params: Promise<{ playerId: string }> }) {
    const user = await getUser();
    if (!user) redirect("/login");

    const { playerId } = await params;
    const id = Number(playerId);

    const player = await getPlayer(id);
    const playerStats = await getPlayerStats(id);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/players" className="text-gray-400 hover:text-white">
                            ← Back
                        </Link>
                        <h1 className="text-xl font-bold">{player.name}</h1>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 py-6">
                <h2 className="text-lg font-semibold mb-4">Player Details</h2>
                <div className="bg-gray-800 p-4 rounded">
                    <p><strong>Name:</strong> {player.name}</p>
                    <p><strong>Position:</strong> {player.position}</p>
                    <p><strong>Number:</strong> {player.capNumber}</p>
                    <p><strong>Goals:</strong> {playerStats.goals || 0}</p>
                </div>
            </main>
        </div>
    );
}