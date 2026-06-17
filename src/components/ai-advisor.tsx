
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Sparkles, BrainCircuit, Loader2, Send, GraduationCap, Target } from "lucide-react";
import { aiAdmissionAdvisor, type AIAdmissionAdvisorOutput } from "@/ai/flows/ai-admission-advisor-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export function AIAdvisor() {
  const [qualifications, setQualifications] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAdmissionAdvisorOutput | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qualifications || !careerGoals) return;

    setLoading(true);
    try {
      const response = await aiAdmissionAdvisor({ qualifications, careerGoals });
      setResult(response);
    } catch (error) {
      console.error("AI Advisor error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-advisor" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <Badge className="bg-accent text-accent-foreground mb-4">Powered by GenAI</Badge>
            <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6">Your Personal <span className="text-primary">AI Career Counselor</span></h2>
            <p className="text-lg text-muted-foreground mb-8">
              Not sure which course to pick? Let our intelligent advisor analyze your background and ambitions to suggest the perfect educational path at Siksha Wallah Hub.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Qualification Analysis</h4>
                  <p className="text-sm text-muted-foreground">Matches your scores and stream with available courses.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Goal Oriented</h4>
                  <p className="text-sm text-muted-foreground">Aligns recommendations with your future professional dream.</p>
                </div>
              </li>
            </ul>
          </div>

          <Card className="border-2 border-primary/10 shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <BrainCircuit className="h-6 w-6" />
                Start Counseling
              </CardTitle>
              <CardDescription>Tell us about yourself for a personalized roadmap</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Academic Qualifications</label>
                  <Input 
                    placeholder="e.g. 12th Pass Science, 75% aggregate" 
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    className="h-12 border-primary/20 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Career Goals</label>
                  <Textarea 
                    placeholder="e.g. I want to become a registered nurse in a government hospital..." 
                    value={careerGoals}
                    onChange={(e) => setCareerGoals(e.target.value)}
                    className="min-h-[120px] border-primary/20 focus-visible:ring-primary"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg bg-primary hover:bg-primary/90 font-medium" 
                  disabled={loading || !qualifications || !careerGoals}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Your Profile...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Get AI Recommendations
                    </>
                  )}
                </Button>
              </form>

              {result && (
                <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                    <h4 className="font-headline font-bold text-lg mb-3 flex items-center gap-2">
                      <Send className="h-5 w-5 text-accent" />
                      Recommended Pathways
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.recommendedPathways.map((path, idx) => (
                        <Badge key={idx} variant="default" className="bg-primary text-white">{path}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold">Advisor's Reasoning</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{result.reasoning}</p>
                  </div>

                  <Alert className="bg-secondary/50 border-secondary">
                    <GraduationCap className="h-4 w-4" />
                    <AlertTitle>Suggested Courses</AlertTitle>
                    <AlertDescription className="text-sm">
                      {result.suitableCourses.join(", ")}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
