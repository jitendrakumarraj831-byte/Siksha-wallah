
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, User, BookOpen, Send } from "lucide-react";
import { saveInquiry } from "@/services/inquiry-service";

export function AdmissionForm() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    course: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    try {
      await saveInquiry({
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
        course: formData.course,
        message: formData.message
      });

      toast({
        title: "Inquiry Sent Successfully!",
        description: "Rajesh Kr. Sah will contact you shortly regarding your admission.",
      });

      setFormData({
        fullName: "",
        mobile: "",
        email: "",
        course: "",
        message: ""
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Something went wrong. Please try again or call directly.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="inquiry" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-headline font-bold mb-4">Admission Inquiry Portal</h2>
            <p className="text-muted-foreground text-lg">Submit your interest for India or Abroad courses. Student Credit Card support available.</p>
          </div>

          <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> Full Name
                  </label>
                  <Input 
                    placeholder="Enter your name" 
                    className="h-12" 
                    required 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" /> Mobile Number
                  </label>
                  <Input 
                    placeholder="+91 00000 00000" 
                    className="h-12" 
                    type="tel" 
                    required 
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" /> Email Address (Optional)
                  </label>
                  <Input 
                    placeholder="name@example.com" 
                    className="h-12" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" /> Course of Interest
                  </label>
                  <Select 
                    required 
                    value={formData.course}
                    onValueChange={(value) => setFormData({...formData, course: value})}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose a course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MBBS / BAMS">MBBS / BAMS / BHMS</SelectItem>
                      <SelectItem value="Nursing">Nursing (B.Sc/GNM/ANM)</SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy (B.Pharm/D.Pharm)</SelectItem>
                      <SelectItem value="Education">B.Ed / D.El.Ed / M.Ed</SelectItem>
                      <SelectItem value="Engineering">Polytechnic / ITI</SelectItem>
                      <SelectItem value="Management">BBA / MBA / BCA / MCA</SelectItem>
                      <SelectItem value="Agriculture">B.Sc Agriculture / Vet</SelectItem>
                      <SelectItem value="Law">LLB / LLM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold">Message or Specific Query</label>
                  <Input 
                    placeholder="Tell us more about your academic background..." 
                    className="h-12" 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <Button type="submit" className="w-full h-14 text-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25" disabled={sending}>
                    {sending ? "Sending..." : "Submit Inquiry Now"}
                    {!sending && <Send className="ml-2 h-5 w-5" />}
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
