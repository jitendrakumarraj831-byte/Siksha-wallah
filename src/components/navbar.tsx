
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-headline text-xl font-bold tracking-tight text-primary">
              SIKSHA WALLAH HUB
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="#courses" className="text-sm font-medium hover:text-primary transition-colors">Course Navigator</Link>
              <Link href="#ai-advisor" className="text-sm font-medium hover:text-primary transition-colors">AI Advisor</Link>
              <Link href="#inquiry" className="text-sm font-medium hover:text-primary transition-colors">Admission Portal</Link>
              <Link href="#location" className="text-sm font-medium hover:text-primary transition-colors">Our Office</Link>
              <Button variant="default" className="bg-primary hover:bg-primary/90">
                Contact Rajesh Sah
              </Button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-accent focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border p-4 space-y-4">
          <Link href="#courses" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-md">Courses</Link>
          <Link href="#ai-advisor" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-md">AI Advisor</Link>
          <Link href="#inquiry" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-md">Admission Portal</Link>
          <Link href="#location" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-md">Office</Link>
          <Button className="w-full bg-primary">Contact Rajesh Sah</Button>
        </div>
      )}
    </nav>
  );
}
