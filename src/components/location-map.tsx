"use client";

import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationMap() {
  return (
    <section id="location" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6">Visit Our Office</h2>
              <p className="text-lg text-muted-foreground">
                We are located at the prime junction of Forbesganj. Drop by for a personal consultation with Rajesh Kr. Sah.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-primary/5">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Main Office Address</h4>
                  <p className="text-muted-foreground">College Chowk, Near HP Petrol Pump,</p>
                  <p className="text-muted-foreground">Forbesganj, Bihar - 854318</p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-primary/5">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Opening Hours</h4>
                  <p className="text-muted-foreground">Monday - Sunday: 09:00 AM - 08:00 PM</p>
                  <p className="text-muted-foreground">Consultations available 7 days a week.</p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-primary/5">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Direct Line</h4>
                  <p className="text-primary font-bold text-xl">+91 62031 38576</p>
                  <p className="text-primary font-bold text-xl">+91 78580 62498</p>
                  <p className="text-sm text-muted-foreground">Pro: Rajesh Kr. Sah</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-primary hover:bg-primary/90 text-lg" onClick={() => window.open('https://maps.google.com/?q=College+Chowk+Forbesganj', '_blank')}>
              <Navigation className="mr-2 h-5 w-5" /> Get Directions
            </Button>
          </div>

          <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <div className="absolute inset-0 bg-slate-200 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-headline font-bold mb-2">College Chowk Hub</h3>
              <p className="text-muted-foreground mb-6">Located near HP Petrol Pump, Forbesganj</p>
              
              <div className="w-full h-48 bg-white/50 border-2 border-dashed border-primary/20 rounded-xl grid grid-cols-6 grid-rows-4 gap-2 p-2">
                <div className="col-span-2 row-span-2 bg-primary/10 rounded flex items-center justify-center text-[10px] text-primary">Office</div>
                <div className="col-span-4 bg-slate-100 rounded">College Chowk Road</div>
                <div className="col-span-1 row-span-3 bg-slate-100 rounded">Main Highway</div>
                <div className="col-span-3 row-span-2 bg-accent/20 rounded flex items-center justify-center text-[10px] text-accent font-bold">HP Petrol Pump</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}