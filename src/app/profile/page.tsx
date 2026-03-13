import { getUserInfo, getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ProfileForm } from "@/components/profile";

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const userInfo = await getUserInfo();
  if (!userInfo) redirect("/login");

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar username={user.username} />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-gray-500 mt-1">Manage your team and account</p>
        </div>

        <ProfileForm userInfo={userInfo} />
      </main>
    </div>
  );
}