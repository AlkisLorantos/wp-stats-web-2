import { SignupForm } from "@/components/signup-form";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SignupPage() {
  const user = await getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-gray-600">Start tracking your team's stats</p>
        </div>

        <SignupForm />

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}