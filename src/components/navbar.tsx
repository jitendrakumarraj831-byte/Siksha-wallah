"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Courses", href: "#courses" },
    { name: "AI Counselor", href: "#ai-advisor" },
    { name: "Admissions", href: "#inquiry" },
    { name: "Location", href: "#location" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300",
      scrolled ? "bg-white/90 backdrop-blur-lg border-b shadow-md h-16" : "bg-transparent h-20"
    )}>
      <div className="container mx-auto px-4 h-full">
        <div className="flex h-full items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-white p-2 rounded-xl border border-primary/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-headline text-2xl font-black tracking-tighter leading-none">
                <span className="text-primary">SIKSHA</span>
              </span>
              <span className="font-headline text-sm font-bold tracking-[0.2em] text-foreground/60">
                WALLAH HUB
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all"
              >
                {link.name}
              </Link>
            ))}
            <Button size="lg" className="rounded-xl px-6 bg-primary font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all hover:scale-105 active:scale-95" onClick={() => window.open('tel:+916203138576')}>
              Call Rajesh Sah <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl bg-secondary text-foreground"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-x-0 top-[100%] bg-white border-b shadow-2xl transition-all duration-300 md:hidden overflow-hidden",
        isOpen ? "max-h-screen opacity-100 py-6" : "max-h-0 opacity-0 py-0"
      )}>
        <div className="container mx-auto px-4 space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className="block text-lg font-bold text-foreground hover:text-primary py-2"
            >
              {link.name}
            </Link>
          ))}
          <Button className="w-full h-12 rounded-xl text-lg font-bold" onClick={() => window.open('tel:+916203138576')}>Contact Now</Button>
        </div>
      </div>
    </nav>
  );
}
