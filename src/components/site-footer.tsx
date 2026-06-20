import Link from "next/link";
import { GraduationCap, Phone, MessageCircle, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-gray-950 text-gray-500 py-12">
      <div className="container-shell">
        <div className="grid gap-8 md:grid-cols-4 mb-8 pb-8 border-b border-gray-800">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-headline font-extrabold text-lg mb-3">
              <GraduationCap size={22} className="text-primary-blue" />
              SIKSHA<span className="text-primary-red">WALLAH</span>
            </div>
            <p className="text-sm leading-relaxed">
              Forbesganj's most trusted admission consultancy. 5,000+ students guided since 2015.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                ["/", "Home"],
                ["/courses", "Courses"],
                ["/student-credit-card", "BSCC Guide"],
                ["/blog", "Blog"],
                ["/about", "About Us"],
                ["/contact", "Contact"],
                ["/auth/login", "Student Login"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-bold text-white mb-4">Courses</h4>
            <ul className="space-y-2 text-sm">
              {[
                "B.Ed / D.El.Ed",
                "B.Sc Nursing / GNM",
                "B.Pharma / D.Pharma",
                "BBA / MBA",
                "B.Tech / Polytechnic",
                "MBBS / BDS",
              ].map((c) => (
                <li key={c}>
                  <Link href="/courses" className="hover:text-white transition">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 text-amber-400 flex-shrink-0" />
                College Chowk, Near HP Petrol Pump, Forbesganj, Araria
              </li>
              {["6203138576", "7858062498", "7979713626", "9162653235"].map((num) => (
                <li key={num}>
                  <a
                    href={`tel:+91${num}`}
                    className="flex items-center gap-2 hover:text-white transition"
                  >
                    <Phone size={13} /> +91 {num}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://wa.me/916203138576"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-400 hover:text-green-300 transition"
                >
                  <MessageCircle size={13} /> WhatsApp Chat
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
          <p>© 2026 Siksha Wallah. All rights reserved. | College Chowk, Forbesganj, Araria, Bihar</p>
          <p>Trusted admission partner — B.Ed • Nursing • Engineering • Management</p>
        </div>
      </div>
    </footer>
  );
}
