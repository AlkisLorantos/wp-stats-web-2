import Link from "next/link";

type Props = {
  username?: string;
};

export function Navbar({ username }: Props) {
  return (
    <header className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
          WP Stats
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/games" className="text-gray-600 hover:text-gray-900">
              Games
            </Link>
            <Link href="/players" className="text-gray-600 hover:text-gray-900">
              Players
            </Link>
            <Link href="/stats" className="text-gray-600 hover:text-gray-900">
              Stats
            </Link>
          </nav>

          <div className="flex items-center gap-4 pl-6 border-l border-gray-300">
            {username && (
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                {username}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}