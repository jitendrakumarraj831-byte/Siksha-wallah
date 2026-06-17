"use client";

import { Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export function FloatingContact() {
  const handleWhatsApp = () => {
    window.open('https://wa.me/916203138576', '_blank');
  };

  const handleCall = () => {
    window.open('tel:+916203138576');
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-xl shadow-green-500/20 animate-in slide-in-from-right-10"
              onClick={handleWhatsApp}
            >
              <MessageSquare className="h-6 w-6 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="font-bold">WhatsApp Inquiry</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 animate-in slide-in-from-right-10 delay-100"
              onClick={handleCall}
            >
              <Phone className="h-6 w-6 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="font-bold">Call Rajesh Kr. Sah</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}