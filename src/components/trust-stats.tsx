"use client";

import { Users, GraduationCap, Building2, Award } from "lucide-react";

const stats = [
  { label: "Students Placed", value: "5000+", icon: Users },
  { label: "Partner Institutions", value: "200+", icon: Building2 },
  { label: "Success Rate", value: "98%", icon: Award },
  { label: "Years Excellence", value: "15+", icon: GraduationCap },
];

export function TrustStats() {
  return (
    <section className="py-12 bg-white border-y border-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-primary/5 rounded-2xl">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-headline font-bold text-primary">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}