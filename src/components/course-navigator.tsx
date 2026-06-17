"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, HeartPulse, Microscope, Briefcase, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";

const courses = [
  {
    category: "Education",
    items: [
      { id: "bed", name: "B.Ed", duration: "2 Years", desc: "Bachelor of Education - ₹50,000 for both years.", image: "course-teaching" },
      { id: "ded", name: "D.El.Ed", duration: "2 Years", desc: "Diploma in Elementary Education - Comprehensive training.", image: "course-teaching" },
      { id: "iti", name: "ITI", duration: "2 Years", desc: "Industrial Training Institute trades.", image: "course-teaching" },
      { id: "law", name: "LAW", duration: "3/5 Years", desc: "Bachelor of Laws (LLB).", image: "course-teaching" },
      { id: "phd", name: "Ph.D.", duration: "3+ Years", desc: "Doctor of Philosophy across various domains.", image: "course-teaching" }
    ]
  },
  {
    category: "Medical",
    items: [
      { id: "mbbs", name: "MBBS", duration: "5.5 Years", desc: "Bachelor of Medicine & Surgery.", image: "course-nursing" },
      { id: "bams", name: "BAMS / BHMS", duration: "5.5 Years", desc: "Ayurvedic and Homeopathic Medicine.", image: "course-nursing" },
      { id: "bsc-n", name: "B.Sc Nursing", duration: "4 Years", desc: "Professional degree in nursing sciences.", image: "course-nursing" },
      { id: "gnm", name: "GNM / ANM", duration: "2-3 Years", desc: "Nursing and Midwifery certifications.", image: "course-nursing" },
      { id: "dmlt", name: "DMLT / BMLT", duration: "2-3 Years", desc: "Medical Laboratory Technology.", image: "course-nursing" }
    ]
  },
  {
    category: "Professional",
    items: [
      { id: "pharm", name: "B.Pharm / D.Pharm", duration: "2-4 Years", desc: "Pharmaceutical sciences and M.Pharma.", image: "course-pharmacy" },
      { id: "comp", name: "BCA / MCA", duration: "3 Years", desc: "Computer applications and development.", image: "course-pharmacy" },
      { id: "mgmt", name: "BBA / MBA", duration: "2-3 Years", desc: "Business management and administration.", image: "course-pharmacy" },
      { id: "poly", name: "Polytechnic", duration: "3 Years", desc: "Diploma in Engineering.", image: "course-pharmacy" },
      { id: "agri", name: "B.Sc Agriculture", duration: "4 Years", desc: "Modern agricultural sciences.", image: "course-pharmacy" }
    ]
  }
];

export function CourseNavigator() {
  return (
    <section id="courses" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 py-1 px-4 border-primary text-primary">Extensive Course Directory</Badge>
          <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6 text-foreground">Explore Your Potential</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Complete list of Distance and Regular courses from India and Abroad. Student Credit Card facilities available.
          </p>
        </div>

        <Tabs defaultValue="Education" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="h-14 p-1 bg-secondary rounded-full flex overflow-x-auto">
              {courses.map((cat) => (
                <TabsTrigger 
                  key={cat.category} 
                  value={cat.category}
                  className="px-8 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-base font-medium"
                >
                  {cat.category === "Education" && <GraduationCap className="mr-2 h-5 w-5" />}
                  {cat.category === "Medical" && <HeartPulse className="mr-2 h-5 w-5" />}
                  {cat.category === "Professional" && <Microscope className="mr-2 h-5 w-5" />}
                  {cat.category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {courses.map((category) => (
            <TabsContent key={category.category} value={category.category} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 focus-visible:outline-none">
              {category.items.map((course) => {
                const courseImg = (PlaceHolderImages || []).find(img => img.id === (course.id.includes('nurs') ? "course-nursing" : course.id.includes('pharm') ? "course-pharmacy" : "course-teaching"));
                return (
                  <Card key={course.id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <Image 
                        src={courseImg?.imageUrl || `https://picsum.photos/seed/${course.id}/600/400`}
                        alt={course.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        data-ai-hint="college education"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-primary hover:bg-white">{course.duration}</Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{course.name}</CardTitle>
                      <CardDescription className="text-sm mt-1">{course.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        <li className="flex items-center text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-accent mr-2" /> Govt. Approved Certifications
                        </li>
                        <li className="flex items-center text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-accent mr-2" /> Distance & Regular Options
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}