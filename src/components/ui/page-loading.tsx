import { LoadingSpinner } from "./loading";

export function PageLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}