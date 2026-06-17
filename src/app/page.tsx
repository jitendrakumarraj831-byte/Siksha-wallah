
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { CourseNavigator } from "@/components/course-navigator";
import { AIAdvisor } from "@/components/ai-advisor";
import { AdmissionForm } from "@/components/admission-form";
import { LocationMap } from "@/components/location-map";
import { FloatingContact } from "@/components/floating-contact";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <CourseNavigator />
      <AIAdvisor />
      <AdmissionForm />
      <LocationMap />
      <Footer />
      <FloatingContact />
      <Toaster />
    </main>
  );
}
