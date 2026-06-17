"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck, Zap, GraduationCap } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  const heroImage = (PlaceHolderImages || []).find(img => img.id === "hero-education");

  return (
    <div className="relative overflow-hidden bg-background pt-16 pb-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold animate-in fade-in slide-in-from-top-4 duration-1000">
              <Sparkles className="h-4 w-4" />
              <span>Forbesganj's #1 Admission Hub</span>
            </div>
            
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold leading-[1.1] text-foreground tracking-tight">
              Crafting <span className="gradient-text">Elite Careers</span> for Future Leaders.
            </h1>
            
            <p className="max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              Step into the future with Siksha Wallah Hub. We bridge the gap between your aspirations and world-class admissions in <strong>Nursing, B.Ed, Pharmacy, and MBBS</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl border-2 hover:bg-secondary">
                Free AI Counseling
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">UGC & NCTE Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">Instant Enrollment</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 mt-16 lg:mt-0 relative">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-black/5 aspect-[4/5] lg:aspect-auto">
              <Image
                src={heroImage?.imageUrl || "https://picsum.photos/seed/hero/800/1000"}
                alt="Elite Education"
                width={800}
                height={1000}
                className="object-cover w-full h-full"
                priority
                data-ai-hint="university campus"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            
            {/* Floating UI Elements */}
            <div className="absolute -bottom-6 -left-6 glass p-6 rounded-3xl shadow-xl max-w-[200px] animate-bounce-slow">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Recent Success</p>
              <p className="text-lg font-bold">120+ MBBS Placements in 2024</p>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-accent p-4 rounded-3xl shadow-xl text-white animate-pulse">
              <GraduationCap className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}