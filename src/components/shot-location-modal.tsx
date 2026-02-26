"use client";

import { useState } from "react";
import { PoolDiagram } from "./pool-diagram";
import { GoalDiagram } from "./goal-diagram";
import type { RosterPlayer } from "@/types";
import { isGoalkeeper } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    poolX: number;
    poolY: number;
    goalX: number;
    goalY: number;
    outcome: string;
    assisterId?: number;
  }) => void;
  scorer: RosterPlayer;
  roster: RosterPlayer[];
};

const outcomes = [
  { key: "GOAL", label: "Goal", color: "bg-green-600 hover:bg-green-700" },
  { key: "SAVED", label: "Saved", color: "bg-yellow-600 hover:bg-yellow-700" },
  { key: "MISSED", label: "Missed", color: "bg-gray-600 hover:bg-gray-700" },
  { key: "BLOCKED", label: "Blocked", color: "bg-orange-600 hover:bg-orange-700" },
  { key: "POST", label: "Post", color: "bg-red-600 hover:bg-red-700" },
];

export function ShotLocationModal({ isOpen, onClose, onSubmit, scorer, roster }: Props) {
  const [step, setStep] = useState<"pool" | "goal" | "outcome" | "assist">("pool");
  const [poolX, setPoolX] = useState<number | undefined>();
  const [poolY, setPoolY] = useState<number | undefined>();
  const [goalX, setGoalX] = useState<number | undefined>();
  const [goalY, setGoalY] = useState<number | undefined>();
  const [outcome, setOutcome] = useState<string | undefined>();

  if (!isOpen) return null;

  const handlePoolSelect = (x: number, y: number) => {
    setPoolX(x);
    setPoolY(y);
  };

  const handleGoalSelect = (x: number, y: number) => {
    setGoalX(x);
    setGoalY(y);
  };

  const handleOutcomeSelect = (selectedOutcome: string) => {
    setOutcome(selectedOutcome);
    if (selectedOutcome === "GOAL") {
      setStep("assist");
    } else {
      submitAndClose(selectedOutcome, undefined);
    }
  };

  const handleAssistSelect = (assisterId: number | null) => {
    submitAndClose(outcome!, assisterId || undefined);
  };

  const submitAndClose = (finalOutcome: string, assisterId?: number) => {
    onSubmit({
      poolX: poolX!,
      poolY: poolY!,
      goalX: goalX!,
      goalY: goalY!,
      outcome: finalOutcome,
      assisterId,
    });
    resetState();
  };

  const resetState = () => {
    setStep("pool");
    setPoolX(undefined);
    setPoolY(undefined);
    setGoalX(undefined);
    setGoalY(undefined);
    setOutcome(undefined);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const canProceedFromPool = poolX !== undefined && poolY !== undefined;
  const canProceedFromGoal = goalX !== undefined && goalY !== undefined;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Shot by #{scorer.capNumber} {scorer.player.name}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {["pool", "goal", "outcome", "assist"].map((s, i) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded ${
                ["pool", "goal", "outcome", "assist"].indexOf(step) >= i
                  ? "bg-blue-500"
                  : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        {step === "pool" && (
          <>
            <PoolDiagram
              onSelect={handlePoolSelect}
              selectedX={poolX}
              selectedY={poolY}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleClose}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep("goal")}
                disabled={!canProceedFromPool}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Goal Location
              </button>
            </div>
          </>
        )}

        {step === "goal" && (
          <>
            <GoalDiagram
              onSelect={handleGoalSelect}
              selectedX={goalX}
              selectedY={goalY}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep("pool")}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep("outcome")}
                disabled={!canProceedFromGoal}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Outcome
              </button>
            </div>
          </>
        )}

        {step === "outcome" && (
          <>
            <h3 className="text-lg font-medium mb-4">What was the outcome?</h3>
            <div className="grid grid-cols-2 gap-3">
              {outcomes.map((o) => (
                <button
                  key={o.key}
                  onClick={() => handleOutcomeSelect(o.key)}
                  className={`p-4 rounded-xl text-lg font-semibold ${o.color}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep("goal")}
              className="w-full mt-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
            >
              Back
            </button>
          </>
        )}

        {step === "assist" && (
          <>
            <h3 className="text-lg font-medium mb-4">Was there an assist?</h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {roster
                .filter((r) => r.playerId !== scorer.playerId)
                .sort((a, b) => a.capNumber - b.capNumber)
                .map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleAssistSelect(r.playerId)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      isGoalkeeper(r.capNumber)
                        ? "bg-red-900/40 border border-red-500 hover:bg-red-900/60"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <div className={`text-xl font-bold ${isGoalkeeper(r.capNumber) ? "text-red-400" : "text-white"}`}>
                      {r.capNumber}
                    </div>
                    <div className="text-xs text-gray-300 truncate">
                      {r.player.name.split(" ")[0]}
                    </div>
                  </button>
                ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep("outcome")}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
              >
                Back
              </button>
              <button
                onClick={() => handleAssistSelect(null)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
              >
                No Assist
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}