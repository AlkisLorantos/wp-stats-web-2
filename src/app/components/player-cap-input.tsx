"use client";

import { useRef } from "react";

type Props = {
  playerId: number;
  capNumber: number | null;
  isGoalkeeper: boolean;
  updateAction: (playerId: number, capNumber: number | null) => Promise<void>;
};

export function PlayerCapInput({ playerId, capNumber, isGoalkeeper, updateAction }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        const cap = formData.get("capNumber") as string;
        await updateAction(playerId, cap ? Number(cap) : null);
      }}
    >
      <input
        name="capNumber"
        type="number"
        min="1"
        max="99"
        defaultValue={capNumber || ""}
        placeholder="—"
        className={`w-14 h-10 text-center text-lg font-bold rounded-lg border-2 transition-all
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${
            capNumber
              ? isGoalkeeper
                ? "border-red-300 bg-red-100 text-red-700"
                : "border-blue-300 bg-blue-50 text-blue-700"
              : "border-gray-200 bg-gray-50 text-gray-400"
          }`}
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