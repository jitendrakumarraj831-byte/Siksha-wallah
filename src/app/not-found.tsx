import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteNavbar />
      <main className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
        <div className="text-center max-w-lg">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-blue text-white mb-6 shadow-lg">
            <GraduationCap size={40} />
          </div>
          <h1 className="font-headline text-7xl font-extrabold text-primary-blue mb-2">404</h1>
          <h2 className="font-headline text-2xl font-bold text-gray-800 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-500 mb-8">
            यह पेज उपलब्ध नहीं है। हमारे होमपेज पर वापस जाएं और सही जानकारी प्राप्त करें।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="rounded-xl bg-primary-blue px-6 py-3 font-bold text-white shadow-md hover:bg-blue-800 transition"
            >
              होमपेज पर जाएं
            </Link>
            <Link
              href="/courses"
              className="rounded-xl border-2 border-primary-blue px-6 py-3 font-bold text-primary-blue hover:bg-blue-50 transition"
            >
              कोर्सेज देखें
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border-2 border-gray-300 px-6 py-3 font-bold text-gray-700 hover:border-gray-400 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
