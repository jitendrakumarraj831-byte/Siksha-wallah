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
  const [showIosHelp, setShowIosHelp] = useState(false);

  // Register the service worker — required for the install prompt to fire.
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  useEffect(() => {
    // Already installed → never show the button.
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
    setShowIosHelp(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  const handleInstall = async () => {
    if (isIOS) {
      setShowIosHelp((v) => !v);
      return;
    }
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") setVisible(false);
    setDeferred(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-5 z-50 flex max-w-[calc(100vw-2.5rem)] flex-col items-start gap-2">
      {isIOS && showIosHelp && (
        <div className="max-w-[260px] rounded-2xl border border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-xl">
          <p className="font-semibold text-gray-900">Install on iPhone</p>
          <p className="mt-1 leading-snug">
            Tap the <Share size={13} className="-mt-0.5 inline" aria-hidden="true" /> Share button, then
            choose <span className="font-semibold">&ldquo;Add to Home Screen&rdquo;</span>.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={handleInstall}
          aria-label="Install the Siksha Wallah app"
          className="group flex items-center gap-2 rounded-full bg-[#003f9f] px-4 py-3 text-white shadow-xl shadow-blue-500/25 transition hover:bg-blue-700 active:scale-95 md:hover:scale-105"
          style={{ willChange: "transform" }}
        >
          <Download size={20} />
          <span className="whitespace-nowrap text-sm font-bold">Install App</span>
        </button>
        <button
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md transition hover:bg-gray-50 hover:text-gray-800"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
