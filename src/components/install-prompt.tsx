"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

// `beforeinstallprompt` is not in the standard TS DOM lib yet.
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

// ── Re-appearance policy ─────────────────────────────────────────────────────
// The prompt was reappearing because (a) a dismissal was permanent-or-nothing
// with no cooldown, and (b) Chrome re-fires `beforeinstallprompt` on navigation,
// and the old handler re-opened the modal without re-checking dismissal. We now
// suppress with a timestamp cooldown AND show at most once per browser session.
const SNOOZE_KEY = "sw-install-snooze-until"; // epoch ms; hidden until this time
const SESSION_KEY = "sw-install-shown-session"; // sessionStorage: shown this visit
const LEGACY_KEY = "sw-install-dismissed"; // older boolean flag (migrated below)
const DAY_MS = 24 * 60 * 60 * 1000;
const SNOOZE_DAYS = 14; // wait this long after "Maybe later" before asking again
const FOREVER_DAYS = 3650; // effectively never (used once installed)
const SHOW_DELAY_MS = 2500; // small delay so it doesn't slam the page on open

function readSnoozeUntil(): number {
  try {
    // Migrate the old permanent flag to a finite cooldown, then use it.
    if (localStorage.getItem(LEGACY_KEY) === "1") {
      const until = Date.now() + SNOOZE_DAYS * DAY_MS;
      localStorage.setItem(SNOOZE_KEY, String(until));
      localStorage.removeItem(LEGACY_KEY);
      return until;
    }
    const raw = localStorage.getItem(SNOOZE_KEY);
    return raw ? Number(raw) || 0 : 0;
  } catch {
    return 0;
  }
}
function isSnoozed(): boolean {
  return Date.now() < readSnoozeUntil();
}
function setSnooze(days: number): void {
  try {
    localStorage.setItem(SNOOZE_KEY, String(Date.now() + days * DAY_MS));
  } catch {}
}
function shownThisSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}
function markShownThisSession(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {}
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Register the service worker — required for the install prompt to fire.
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  useEffect(() => {
    // Already installed → never show the prompt.
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;

    let showTimer: ReturnType<typeof setTimeout> | undefined;

    // Central gate: may we auto-open the modal right now? Re-checked on every
    // trigger so a re-fired browser event during a cooldown can't sneak it back.
    const canAutoShow = () => !isSnoozed() && !shownThisSession();
    const show = () => {
      if (!canAutoShow()) return;
      markShownThisSession();
      setVisible(true);
    };

    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    const inSafari = ios && !/crios|fxios|edgios/.test(ua);
    if (ios) {
      // iOS Safari never fires `beforeinstallprompt` — show manual steps instead.
      if (inSafari && canAutoShow()) {
        setIsIOS(true);
        showTimer = setTimeout(show, SHOW_DELAY_MS);
      }
      return () => { if (showTimer) clearTimeout(showTimer); };
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      // Always capture the event so Install still works if shown later…
      setDeferred(e as BeforeInstallPromptEvent);
      // …but only auto-open within policy (not snoozed, once per session).
      if (canAutoShow()) {
        if (showTimer) clearTimeout(showTimer);
        showTimer = setTimeout(show, SHOW_DELAY_MS);
      }
    };
    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
      setSnooze(FOREVER_DAYS); // installed → don't ask again
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      if (showTimer) clearTimeout(showTimer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  // "Maybe later" / close / tap-outside → hide and snooze for SNOOZE_DAYS.
  const dismiss = () => {
    setVisible(false);
    setSnooze(SNOOZE_DAYS);
  };

  const handleInstall = async () => {
    if (isIOS) return; // iOS shows manual steps in the card itself
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
      setSnooze(FOREVER_DAYS);
    } else {
      // User declined the native sheet → treat like "maybe later".
      setSnooze(SNOOZE_DAYS);
    }
    setDeferred(null);
  };

  if (!visible) return null;

  // Centered modal shown automatically when the website opens.
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Install Siksha Wallah app"
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          aria-label="Close install prompt"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#003f9f] text-white shadow-lg shadow-blue-500/25">
            <Download size={30} />
          </div>
          <h3 className="mt-4 text-lg font-extrabold text-gray-900">
            Install Siksha Wallah App
          </h3>
          <p className="mt-1.5 text-sm leading-snug text-gray-600">
            Add our app to your home screen for faster access, offline support and
            a smoother experience.
          </p>

          {isIOS ? (
            <div className="mt-5 w-full rounded-xl bg-blue-50 p-3 text-left text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Install on iPhone</p>
              <p className="mt-1 leading-snug">
                Tap the{" "}
                <Share size={13} className="-mt-0.5 inline" aria-hidden="true" /> Share
                button, then choose{" "}
                <span className="font-semibold">&ldquo;Add to Home Screen&rdquo;</span>.
              </p>
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#003f9f] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 active:scale-95"
            >
              <Download size={18} />
              Install App
            </button>
          )}

          <button
            onClick={dismiss}
            className="mt-3 text-sm font-semibold text-gray-500 transition hover:text-gray-800"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
