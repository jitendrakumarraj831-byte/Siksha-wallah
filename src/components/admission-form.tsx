
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Mail, Phone, User, BookOpen } from "lucide-react";

export function AdmissionForm() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({
        title: "Inquiry Sent!",
        description: "Rajesh Sah will contact you shortly regarding your admission.",
      });
    }, 1500);
  };

  return (
    <section id="inquiry" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-headline font-bold mb-4">Admission Inquiry Portal</h2>
            <p className="text-muted-foreground text-lg">Quickly submit your interest and our administrative team will reach out with detailed brochures and fee structures.</p>
          </div>

          <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> Full Name
                  </label>
                  <Input placeholder="Enter your name" className="h-12" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" /> Mobile Number
                  </label>
                  <Input placeholder="+91 00000 00000" className="h-12" type="tel" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" /> Email Address (Optional)
                  </label>
                  <Input placeholder="name@example.com" className="h-12" type="email" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" /> Course of Interest
                  </label>
                  <Select required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose a course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bed">B.Ed (Bachelor of Education)</SelectItem>
                      <SelectItem value="ded">D.El.Ed (Diploma in El. Ed)</SelectItem>
                      <SelectItem value="nursing">B.Sc Nursing / GNM</SelectItem>
                      <SelectItem value="pharmacy">B.Pharm / D.Pharm</SelectItem>
                      <SelectItem value="mbbs">MBBS / BAMS / BHMS</SelectItem>
                      <SelectItem value="other">Other Professional Course</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold">Message or Specific Query</label>
                  <Input placeholder="Tell us more about your requirements..." className="h-12" />
                </div>
                <div className="md:col-span-2 pt-4">
                  <Button type="submit" className="w-full h-14 text-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25" disabled={sending}>
                    {sending ? "Sending..." : "Submit Inquiry Now"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
