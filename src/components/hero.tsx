
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Stethoscope, Briefcase } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";

export function Hero() {
  const heroImage = (PlaceHolderImages || []).find(img => img.id === "hero-education");

  return (
    <div className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="font-headline text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl text-primary">
              Shape Your Future at <span className="text-accent">Siksha Wallah Hub</span>
            </h1>
            <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
               Forbesganj's premier educational consultancy. We provide expert guidance for B.Ed, MBBS, Nursing, and Pharmacy admissions. Start your professional journey with trust and clarity.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
              <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 font-medium">
                Browse Courses <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-primary text-primary font-medium">
                Find My Path
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-6 opacity-80">
              <div className="flex flex-col items-center lg:items-start">
                <BookOpen className="h-6 w-6 text-accent mb-2" />
                <span className="text-sm font-semibold">Teacher Training</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <Stethoscope className="h-6 w-6 text-accent mb-2" />
                <span className="text-sm font-semibold">Healthcare</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <Briefcase className="h-6 w-6 text-accent mb-2" />
                <span className="text-sm font-semibold">Management</span>
              </div>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-3xl shadow-2xl overflow-hidden border-8 border-white ring-1 ring-primary/10">
              <Image
                src={heroImage?.imageUrl || "https://picsum.photos/seed/hero/1200/600"}
                alt={heroImage?.description || "Education hero"}
                width={1200}
                height={600}
                className="object-cover w-full aspect-[4/3]"
                data-ai-hint="college campus students"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
