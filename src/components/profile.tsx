"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateTeamName,
  regenerateApiKey,
  deleteAccount,
  UserInfo,
  exportData,
} from "@/lib/auth";

type Props = {
  userInfo: UserInfo;
};

export function ProfileForm({ userInfo }: Props) {
  const router = useRouter();
  const [teamName, setTeamName] = useState(userInfo.team.name);
  const [apiKey, setApiKey] = useState(userInfo.apiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);

  const handleUpdateTeamName = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await updateTeamName(teamName);

    if (result.success) {
      setMessage({ type: "success", text: "Team name updated" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update" });
    }

    setSaving(false);
  };

  const handleRegenerateApiKey = async () => {
    if (
      !confirm(
        "Are you sure? Any applications using the current key will stop working.",
      )
    ) {
      return;
    }

    setRegenerating(true);
    setMessage(null);

    const result = await regenerateApiKey();

    if (result.success && result.apiKey) {
      setApiKey(result.apiKey);
      setShowApiKey(true);
      setMessage({ type: "success", text: "API key regenerated" });
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to regenerate",
      });
    }

    setRegenerating(false);
  };

  const handleExport = async (type: "players" | "games" | "stats") => {
    setExporting(type);
    setMessage(null);

    const result = await exportData(type);

    if (result.success && result.csv) {
      const blob = new Blob([result.csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename || `${type}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setMessage({ type: "success", text: `${type} exported successfully` });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to export" });
    }

    setExporting(null);
  };

  const handleDeleteAccount = async () => {
    if (confirmDelete !== "DELETE") {
      setMessage({ type: "error", text: "Please type DELETE to confirm" });
      return;
    }

    setDeleting(true);
    setMessage(null);

    const result = await deleteAccount(confirmDelete);

    if (result.success) {
      router.push("/login");
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to delete account",
      });
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">User Info</h2>
        <p>
          <span className="text-gray-500">Username:</span> {userInfo.username}
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Team</h2>
        <form onSubmit={handleUpdateTeamName} className="flex gap-3">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={saving || teamName === userInfo.team.name}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">API Key</h2>
        <p className="text-sm text-gray-500 mb-4">
          Use this key to access the API from external applications.
        </p>
        <div className="flex gap-3 items-center mb-4">
          <code className="flex-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg font-mono text-sm overflow-x-auto">
            {showApiKey ? apiKey : "••••••••••••••••••••••••••••••••"}
          </code>
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            {showApiKey ? "Hide" : "Show"}
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(apiKey);
              setMessage({
                type: "success",
                text: "API key copied to clipboard",
              });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Copy
          </button>
        </div>
        <button
          onClick={handleRegenerateApiKey}
          disabled={regenerating}
          className="px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 disabled:opacity-50"
        >
          {regenerating ? "Regenerating..." : "Regenerate Key"}
        </button>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Export Data</h2>
        <p className="text-sm text-gray-500 mb-4">
          Download your data as CSV files for backup or analysis.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleExport("players")}
            disabled={exporting !== null}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            {exporting === "players" ? "Exporting..." : "Export Players"}
          </button>
          <button
            onClick={() => handleExport("games")}
            disabled={exporting !== null}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            {exporting === "games" ? "Exporting..." : "Export Games"}
          </button>
          <button
            onClick={() => handleExport("stats")}
            disabled={exporting !== null}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            {exporting === "stats" ? "Exporting..." : "Export Stats"}
          </button>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-red-700 mb-4">
          Delete Account
        </h2>
        <p className="text-sm text-red-600 mb-4">
          Deleting your account will permanently remove all your data including
          your team, players, games, and stats. This action cannot be undone.
        </p>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm text-red-600 mb-1">
              Type DELETE to confirm
            </label>
            <input
              type="text"
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting || confirmDelete !== "DELETE"}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
