
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookMarked, HeartPulse, Microscope, GraduationCap, Clock, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";

const courses = [
  {
    category: "Education",
    items: [
      { id: "bed", name: "B.Ed", duration: "2 Years", desc: "Professional teaching degree for secondary school careers.", image: "course-teaching" },
      { id: "ded", name: "D.El.Ed", duration: "2 Years", desc: "Diploma for primary education excellence.", image: "course-teaching" }
    ]
  },
  {
    category: "Nursing",
    items: [
      { id: "gnm", name: "GNM", duration: "3 Years", desc: "General Nursing and Midwifery certification.", image: "course-nursing" },
      { id: "bsc-n", name: "B.Sc Nursing", duration: "4 Years", desc: "Professional undergraduate nursing degree.", image: "course-nursing" }
    ]
  },
  {
    category: "Pharmacy",
    items: [
      { id: "dph", name: "D.Pharm", duration: "2 Years", desc: "Diploma in Pharmacy for basic clinical roles.", image: "course-pharmacy" },
      { id: "bph", name: "B.Pharm", duration: "4 Years", desc: "Bachelor's degree in Pharmaceutical sciences.", image: "course-pharmacy" }
    ]
  }
];

export function CourseNavigator() {
  return (
    <section id="courses" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 py-1 px-4 border-primary text-primary">Course Directory</Badge>
          <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6 text-foreground">Explore Your Potential</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            A comprehensive list of professional degrees and diplomas to launch your academic and professional career.
          </p>
        </div>

        <Tabs defaultValue="Education" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="h-14 p-1 bg-secondary rounded-full">
              {courses.map((cat) => (
                <TabsTrigger 
                  key={cat.category} 
                  value={cat.category}
                  className="px-8 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-base font-medium"
                >
                  {cat.category === "Education" && <GraduationCap className="mr-2 h-5 w-5" />}
                  {cat.category === "Nursing" && <HeartPulse className="mr-2 h-5 w-5" />}
                  {cat.category === "Pharmacy" && <Microscope className="mr-2 h-5 w-5" />}
                  {cat.category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {courses.map((category) => (
            <TabsContent key={category.category} value={category.category} className="grid grid-cols-1 md:grid-cols-2 gap-8 focus-visible:outline-none">
              {category.items.map((course) => {
                const courseImg = (PlaceHolderImages || []).find(img => img.id === course.image);
                return (
                  <Card key={course.id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="relative h-64 overflow-hidden">
                      <Image 
                        src={courseImg?.imageUrl || `https://picsum.photos/seed/${course.id}/600/400`}
                        alt={course.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        data-ai-hint={course.image === "course-nursing" ? "nursing student" : "classroom teaching"}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-primary hover:bg-white">{course.duration}</Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-2xl font-headline group-hover:text-primary transition-colors">{course.name}</CardTitle>
                      <CardDescription className="text-base mt-2">{course.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2" /> UGC/NCTE/INC Approved
                        </li>
                        <li className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2" /> Placement Assistance Available
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
