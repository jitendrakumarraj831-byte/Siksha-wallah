"use client";

import { useState } from "react";
import { AlertTriangle, Loader, X } from "lucide-react";

// Shared type-to-confirm guard for every destructive office action (delete
// student / application / document). The Delete button stays disabled until
// the office types the exact confirm word — a plain confirm() dialog is too
// easy to click through by habit for something irreversible.
interface Props {
  title: string;
  message: string;
  /** What the office must type exactly (case-insensitive) to enable Delete — e.g. the student's name. */
  confirmWord: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export function ConfirmDeleteModal({ title, message, confirmWord, confirmLabel = "Delete Permanently", onConfirm, onClose }: Props) {
  const [typed, setTyped] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const matched = typed.trim().toLowerCase() === confirmWord.trim().toLowerCase();

  async function handleConfirm() {
    if (!matched) return;
    setSaving(true);
    setErr("");
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertTriangle size={17} />
            </span>
            <h3 className="font-extrabold text-gray-900">{title}</h3>
          </div>
          <button onClick={onClose} aria-label="Cancel" disabled={saving}><X size={18} className="text-gray-400" /></button>
        </div>

        <p className="mt-4 text-sm text-gray-600">{message}</p>
        <p className="mt-2 text-sm font-bold text-red-600">This cannot be undone.</p>

        <label className="mt-4 block text-xs font-bold text-gray-500">
          Type <span className="font-mono text-gray-800">{confirmWord}</span> to confirm:
        </label>
        <input
          autoFocus
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          disabled={saving}
          className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red-400"
        />

        {err && <p className="mt-3 text-xs font-semibold text-red-600">{err}</p>}

        <div className="mt-5 flex gap-3">
          <button onClick={onClose} disabled={saving}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={!matched || saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40">
            {saving ? <Loader size={14} className="animate-spin" /> : null} {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
