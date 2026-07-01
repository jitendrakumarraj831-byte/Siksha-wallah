"use client";

// One canonical admission timeline, shared by BOTH the Student Portal and the
// Office Portal. Before this, each page drew its own stepper with slightly
// different labels/logic; now the same four stages render identically wherever
// an admission is shown, so a student and a counsellor always see the same
// journey. Stage data + meaning come from `@/lib/admission-journey`.

import { JOURNEY_STAGES, stageIndex, type DocState } from "@/lib/admission-journey";
import type { ApplicationStatus } from "@/services/application-service";
import { Check } from "lucide-react";

interface Props {
  status?: ApplicationStatus;
  /** Refines the wording of the "Document Verification" stage when known. */
  docState?: DocState;
  variant?: "compact" | "full";
  className?: string;
}

function stageNote(stageKey: string, current: boolean, docState?: DocState): string | null {
  if (stageKey !== "documents_pending" || !docState) return null;
  if (docState === "approved") return "Approved";
  if (docState === "rejected") return current ? "Re-upload needed" : null;
  if (docState === "pending") return current ? "Under review" : null;
  if (docState === "none") return current ? "Upload pending" : null;
  return null;
}

export function AdmissionTimeline({ status, docState, variant = "compact", className = "" }: Props) {
  const idx = stageIndex(status);
  const closed = status === "not_interested";
  const allDone = status === "admission_done";

  if (closed) {
    return (
      <div className={`rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-500 ${className}`}>
        This application has been closed.
      </div>
    );
  }

  if (variant === "full") {
    return (
      <ol className={`relative space-y-0 ${className}`}>
        {JOURNEY_STAGES.map((s, i) => {
          const done = i < idx || (i === idx && allDone);
          const current = i === idx && !allDone;
          const note = stageNote(s.key, current, docState);
          const last = i === JOURNEY_STAGES.length - 1;
          return (
            <li key={s.key} className="flex gap-3">
              {/* Rail */}
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ring-4 ring-white ${
                    done ? "bg-green-500 text-white"
                    : current ? "bg-[#003f9f] text-white"
                    : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {done ? <Check size={14} /> : i + 1}
                </span>
                {!last && <span className={`w-0.5 flex-1 ${i < idx ? "bg-green-500" : "bg-gray-200"}`} style={{ minHeight: 22 }} />}
              </div>
              {/* Label */}
              <div className={`pb-4 ${last ? "pb-0" : ""}`}>
                <p className={`text-sm font-bold ${current ? "text-[#003f9f]" : done ? "text-gray-800" : "text-gray-400"}`}>
                  {s.label}
                  {current && <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#003f9f]">Current</span>}
                </p>
                <p className="text-xs text-gray-400">{s.desc}</p>
                {note && (
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    note === "Approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {note}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  // Compact horizontal stepper.
  return (
    <ol className={`flex items-start ${className}`}>
      {JOURNEY_STAGES.map((s, i) => {
        const done = i < idx || (i === idx && allDone);
        const current = i === idx && !allDone;
        const last = i === JOURNEY_STAGES.length - 1;
        return (
          <li key={s.key} className="flex min-w-0 flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <span className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : i <= idx ? "bg-green-500" : "bg-gray-200"}`} />
              <span
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  done ? "bg-green-500 text-white"
                  : current ? "bg-[#003f9f] text-white"
                  : "bg-gray-200 text-gray-500"
                }`}
              >
                {done ? <Check size={12} /> : i + 1}
              </span>
              <span className={`h-0.5 flex-1 ${last ? "opacity-0" : i < idx ? "bg-green-500" : "bg-gray-200"}`} />
            </div>
            <span className={`mt-1 px-0.5 text-[9px] leading-tight ${current ? "font-bold text-[#003f9f]" : done ? "text-gray-600" : "text-gray-400"}`}>
              {s.short}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
