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
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled ? "bg-white/80 backdrop-blur-lg border-b shadow-sm h-16" : "bg-transparent h-20"
    )}>
      <div className="container mx-auto px-4 h-full">
        <div className="flex h-full items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-headline text-xl font-bold tracking-tighter text-primary">
              SIKSHA WALLAH <span className="text-foreground">HUB</span>
            </span>
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
            <Button size="lg" className="rounded-xl px-6 bg-primary font-bold shadow-lg shadow-primary/20 hover:shadow-xl">
              Talk to Rajesh Sah <ChevronRight className="ml-1 h-4 w-4" />
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
          <Button className="w-full h-12 rounded-xl text-lg font-bold">Contact Now</Button>
        </div>
      </div>
    </nav>
  );
}