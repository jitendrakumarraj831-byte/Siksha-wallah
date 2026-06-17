import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { TrustStats } from "@/components/trust-stats";
import { CourseNavigator } from "@/components/course-navigator";
import { AIAdvisor } from "@/components/ai-advisor";
import { AdmissionForm } from "@/components/admission-form";
import { LocationMap } from "@/components/location-map";
import { FloatingContact } from "@/components/floating-contact";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <TrustStats />
      <CourseNavigator />
      <div className="bg-slate-50">
        <AIAdvisor />
      </div>
      <AdmissionForm />
      <LocationMap />
      <Footer />
      <FloatingContact />
      <Toaster />
    </main>
  );
}