"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

// `beforeinstallprompt` is not in the standard TS DOM lib yet.
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "sw-install-dismissed";

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

    // Respect a previous dismissal.
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    const inSafari = ios && !/crios|fxios|edgios/.test(ua);
    if (ios) {
      // iOS Safari never fires `beforeinstallprompt` — show manual steps instead.
      if (inSafari) {
        setIsIOS(true);
        setVisible(true);
      }
      return;
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
      try {
        localStorage.setItem(DISMISS_KEY, "1");
      } catch {}
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  const handleInstall = async () => {
    if (isIOS) return; // iOS shows manual steps in the card itself
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
      try {
        localStorage.setItem(DISMISS_KEY, "1");
      } catch {}
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
