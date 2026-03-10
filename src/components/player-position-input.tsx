"use client";

import { useRef } from "react";

type Props = {
  playerId: number;
  position: string | null;
  updateAction: (playerId: number, position: string | undefined) => Promise<void>;
};

export function PlayerPositionInput({ playerId, position, updateAction }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        const pos = formData.get("position") as string;
        await updateAction(playerId, pos || undefined);
      }}
    >
      <input
        name="position"
        defaultValue={position || ""}
        placeholder="—"
        className="w-full px-2 py-1 text-sm text-gray-600 bg-transparent border border-transparent rounded
          hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
        onBlur={() => formRef.current?.requestSubmit()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            formRef.current?.requestSubmit();
          }
        }}
      />
    </form>
  );
}