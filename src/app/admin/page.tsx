
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllInquiries, type Inquiry } from "@/services/inquiry-service";
import { useAuth } from "@/components/auth-provider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, BookOpen, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || (userProfile?.role !== "admin" && userProfile?.role !== "counselor")) {
      router.replace("/admin/login");
      return;
    }
    async function fetchData() {
      const data = await getAllInquiries();
      setInquiries(data);
      setLoading(false);
    }
    fetchData();
  }, [authLoading, isAuthenticated, userProfile, router]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-headline font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage student inquiries for Siksha Wallah Hub</p>
          </div>
          <Badge variant="outline" className="text-lg py-1 px-4 border-primary text-primary">
            {inquiries.length} New Leads
          </Badge>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Recent Admissions Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No inquiries found yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead><Clock className="h-4 w-4 mr-2 inline" />Time</TableHead>
                      <TableHead><User className="h-4 w-4 mr-2 inline" />Student Name</TableHead>
                      <TableHead><Phone className="h-4 w-4 mr-2 inline" />Contact</TableHead>
                      <TableHead><BookOpen className="h-4 w-4 mr-2 inline" />Course</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiries.map((inquiry) => (
                      <TableRow key={inquiry.id} className="hover:bg-slate-50/50">
                        <TableCell className="whitespace-nowrap font-medium text-xs">
                          {inquiry.createdAt?.toDate().toLocaleString() || "Just now"}
                        </TableCell>
                        <TableCell className="font-bold">{inquiry.fullName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold">{inquiry.mobile}</span>
                            <span className="text-xs text-muted-foreground">{inquiry.email || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20">
                            {inquiry.course}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sm">
                          {inquiry.message || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
