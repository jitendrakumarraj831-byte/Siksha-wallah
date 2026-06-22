"use client";

import { Phone, MessageCircle } from "lucide-react";

export function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
      {/* Call button */}
      <a
        href="tel:+916203138576"
        aria-label="Call our admission counsellor"
        className="group flex items-center gap-2 rounded-full bg-[#003f9f] px-4 py-3 text-white shadow-xl shadow-blue-500/25 transition hover:scale-105 hover:bg-blue-700 active:scale-95"
      >
        <Phone size={20} />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 group-hover:max-w-xs">
          Speak to a Counsellor
        </span>
      </a>

      {/* WhatsApp button */}
      <a
        href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20Siksha%20Wallah%20से%20admission%20guidance%20चाहिए।%20Please%20help%20karein।"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with our counsellor on WhatsApp"
        className="group flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-white shadow-xl shadow-green-500/25 transition hover:scale-105 hover:bg-green-600 active:scale-95"
      >
        <MessageCircle size={20} fill="currentColor" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 group-hover:max-w-xs">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
