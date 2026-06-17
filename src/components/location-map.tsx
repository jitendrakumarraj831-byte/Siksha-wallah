
"use client";

import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
                We are conveniently located in the heart of Forbesganj. Drop by for a face-to-face consultation with Rajesh Sah.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-primary/5">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Main Office Address</h4>
                  <p className="text-muted-foreground">Near HP Petrol Pump, Forbesganj,</p>
                  <p className="text-muted-foreground">Araria District, Bihar - 854318</p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-primary/5">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Opening Hours</h4>
                  <p className="text-muted-foreground">Monday - Saturday: 10:00 AM - 07:00 PM</p>
                  <p className="text-muted-foreground">Sunday: By Appointment Only</p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-primary/5">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Direct Line</h4>
                  <p className="text-primary font-bold text-xl">+91 99346 54XXX</p>
                  <p className="text-sm text-muted-foreground">Ask for Mr. Rajesh Sah</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-primary hover:bg-primary/90 text-lg">
              <Navigation className="mr-2 h-5 w-5" /> Get Directions on Google Maps
            </Button>
          </div>

          <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            {/* Placeholder for actual map integration */}
            <div className="absolute inset-0 bg-slate-200 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-headline font-bold mb-2">Forbesganj Hub</h3>
              <p className="text-muted-foreground mb-6">Visual representation of our office near HP Petrol Pump</p>
              
              {/* This simulates a map grid */}
              <div className="w-full h-48 bg-white/50 border-2 border-dashed border-primary/20 rounded-xl grid grid-cols-6 grid-rows-4 gap-2 p-2">
                <div className="col-span-2 row-span-2 bg-primary/10 rounded flex items-center justify-center text-[10px] text-primary">Office</div>
                <div className="col-span-4 bg-slate-100 rounded">Main Road</div>
                <div className="col-span-1 row-span-3 bg-slate-100 rounded">Street</div>
                <div className="col-span-3 row-span-2 bg-accent/20 rounded flex items-center justify-center text-[10px] text-accent font-bold">HP Petrol Pump</div>
              </div>
            </div>
            
            <div className="absolute bottom-6 left-6 right-6 bg-white p-4 rounded-xl shadow-lg border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Location Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
