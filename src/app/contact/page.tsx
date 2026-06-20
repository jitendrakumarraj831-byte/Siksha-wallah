"use client";

import { useState } from "react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { saveInquiry } from "@/services/inquiry-service";
import {
  Phone, MessageCircle, MapPin, Clock, CheckCircle2,
  Send, ArrowRight, Mail, User,
} from "lucide-react";

const counsellors = [
  { name: "Rajesh Kumar Sah", role: "Founder & Chief Counsellor", phone: "6203138576", expertise: "B.Ed, D.El.Ed, All Courses" },
  { name: "Helpline 2", role: "Admission Helpline", phone: "7858062498", expertise: "BSCC, Nursing, Pharmacy" },
  { name: "Helpline 3", role: "Medical & Nursing Helpline", phone: "9472813581", expertise: "Nursing, B.Pharma, MBBS — Pan-India" },
  { name: "Gautam Kumar", role: "BSCC Enquiry & Branch Office", phone: "9162653235", expertise: "Bihar Student Credit Card — Kursakanta" },
];

const officeHours = [
  ["Monday – Saturday", "9:00 AM – 6:00 PM"],
  ["Sunday", "10:00 AM – 2:00 PM (Emergency only)"],
  ["WhatsApp", "24/7 Available"],
];

export default function ContactPage() {
  const [form, setForm] = useState({ fullName: "", mobile: "", email: "", course: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveInquiry({ fullName: form.fullName, mobile: form.mobile, course: form.course, message: form.message });

      // Send email via API
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.fullName, phone: form.mobile, email: form.email, course: form.course, message: form.message }),
        });
        if (res.ok) setEmailSent(true);
      } catch (_) {
        // Email failure is non-blocking
      }

      const msg = `New Inquiry from Contact Page!%0AName: ${form.fullName}%0AMobile: ${form.mobile}%0ACourse: ${form.course}%0AMessage: ${form.message}`;
      window.open(`https://wa.me/916203138576?text=${msg}`, "_blank");
      setSubmitted(true);
    } catch (_) {
      alert("Error submitting. Please call us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SiteNavbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#001f6b] to-[#003f9f] py-16 text-white text-center">
          <div className="container-shell">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-3">Get In Touch</p>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4">
              हमसे <span className="text-amber-400">Contact</span> करें
            </h1>
            <p className="text-blue-100 max-w-xl mx-auto">
              Admission inquiry, BSCC guidance, या कोई भी सवाल — हम यहाँ हैं। Call करें, WhatsApp करें, या form fill करें।
            </p>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container-shell">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">

              {/* LEFT — Contact Info */}
              <div className="space-y-6">
                {/* Office Address */}
                <div className="rounded-2xl bg-white border-2 border-gray-100 p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#003f9f] text-white">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <h3 className="font-headline text-lg font-extrabold text-gray-900">Office Address</h3>
                      <p className="mt-1 text-gray-600">College Chowk, Near HP Petrol Pump</p>
                      <p className="text-gray-600">Forbesganj, Araria — Bihar 854318</p>
                      <a
                        href="https://maps.google.com/?q=College+Chowk+Forbesganj+Araria+Bihar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-[#003f9f] hover:underline"
                      >
                        Open in Google Maps →
                      </a>
                    </div>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="rounded-2xl bg-white border-2 border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock size={20} className="text-[#003f9f]" />
                    <h3 className="font-headline text-lg font-extrabold text-gray-900">Office Hours</h3>
                  </div>
                  <div className="space-y-2">
                    {officeHours.map(([day, time]) => (
                      <div key={day} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                        <span className="font-semibold text-gray-700">{day}</span>
                        <span className="text-[#003f9f] font-bold">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Counsellors */}
                <div className="space-y-3">
                  <h3 className="font-headline text-lg font-extrabold text-gray-900">Call Our Counsellors</h3>
                  {counsellors.map(({ name, role, phone, expertise }) => (
                    <a
                      key={phone}
                      href={`tel:+91${phone}`}
                      className="flex items-center gap-4 rounded-2xl bg-white border-2 border-gray-100 p-4 shadow-sm hover:border-[#003f9f] hover:shadow-md transition"
                    >
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#003f9f] font-headline font-extrabold text-lg text-white">
                        {name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{name}</p>
                        <p className="text-xs text-[#003f9f] font-semibold">{role}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{expertise}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm">+91 {phone}</p>
                        <span className="text-xs text-green-600 font-semibold">Call Now</span>
                      </div>
                    </a>
                  ))}
                </div>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/916203138576?text=Hi! I need admission guidance from Siksha Wallah."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 rounded-2xl bg-green-500 px-6 py-4 font-extrabold text-white hover:bg-green-600 transition shadow-lg shadow-green-500/20"
                >
                  <MessageCircle size={22} fill="currentColor" /> WhatsApp पर Chat करें (24/7)
                </a>
              </div>

              {/* RIGHT — Contact Form */}
              <div className="rounded-2xl bg-white border-2 border-gray-100 p-8 shadow-sm">
                {submitted ? (
                  <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <CheckCircle2 size={64} className="text-green-500" />
                    <h3 className="font-headline text-2xl font-extrabold text-gray-900">धन्यवाद! 🎉</h3>
                    <p className="text-gray-500 max-w-xs">
                      आपकी inquiry save हो गई है। हमारा counsellor 30 minutes में WhatsApp/Call करेगा।
                      {emailSent && " Confirmation email भी भेजी गई है।"}
                    </p>
                    <div className="flex gap-3 mt-2">
                      <a href="tel:+916203138576" className="inline-flex items-center gap-2 rounded-xl bg-[#003f9f] px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
                        <Phone size={15} /> Call Now
                      </a>
                      <button onClick={() => { setSubmitted(false); setForm({ fullName: "", mobile: "", email: "", course: "", message: "" }); }} className="rounded-xl border-2 border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 hover:border-gray-300">
                        New Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="font-headline text-2xl font-extrabold text-gray-900 mb-1">Send Inquiry</h2>
                    <p className="text-gray-500 text-sm mb-6">
                      Form fill करें — Inquiry WhatsApp पर भी जाएगी और email confirm होगा।
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Full Name *</label>
                        <div className="relative">
                          <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                          <input
                            required
                            value={form.fullName}
                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                            placeholder="Your full name"
                            className="w-full rounded-xl border-2 border-gray-200 pl-10 pr-4 py-3.5 text-sm outline-none focus:border-[#003f9f] transition"
                          />
                        </div>
                      </div>

                      {/* Mobile */}
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Mobile Number *</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                          <input
                            required
                            type="tel"
                            value={form.mobile}
                            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                            placeholder="10-digit mobile number"
                            className="w-full rounded-xl border-2 border-gray-200 pl-10 pr-4 py-3.5 text-sm outline-none focus:border-[#003f9f] transition"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email (Optional)</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="your@email.com"
                            className="w-full rounded-xl border-2 border-gray-200 pl-10 pr-4 py-3.5 text-sm outline-none focus:border-[#003f9f] transition"
                          />
                        </div>
                      </div>

                      {/* Course */}
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Course Interested In</label>
                        <select
                          value={form.course}
                          onChange={(e) => setForm({ ...form, course: e.target.value })}
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm text-gray-600 outline-none focus:border-[#003f9f] bg-white transition"
                        >
                          <option value="">-- Select Course --</option>
                          <optgroup label="Teaching">
                            <option>B.Ed</option><option>D.El.Ed</option><option>M.Ed</option>
                          </optgroup>
                          <optgroup label="Medical & Nursing">
                            <option>MBBS</option><option>BDS</option><option>B.Sc Nursing</option>
                            <option>GNM</option><option>ANM</option><option>B.Pharma</option>
                          </optgroup>
                          <optgroup label="Technical & Management">
                            <option>B.Tech</option><option>Polytechnic</option><option>ITI</option>
                            <option>BCA</option><option>MCA</option><option>BBA</option><option>MBA</option>
                          </optgroup>
                          <option>BSCC Guidance</option>
                          <option>Not decided yet</option>
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Message / Query (Optional)</label>
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          rows={4}
                          placeholder="Apna question ya special requirement likhein..."
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-[#003f9f] transition resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-4 font-extrabold text-white hover:bg-blue-700 transition disabled:opacity-60 shadow-lg shadow-blue-200 active:scale-95"
                      >
                        {loading ? (
                          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                          <><Send size={18} /> Submit Inquiry</>
                        )}
                      </button>
                      <p className="text-center text-xs text-gray-400">
                        100% Free. No spam. Inquiry will be saved + WhatsApp redirect.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Real Google Maps Embed */}
        <section className="bg-white pb-20">
          <div className="container-shell">
            <h2 className="font-headline text-xl font-bold text-gray-800 mb-4 text-center">
              हमारा Location — College Chowk, Forbesganj
            </h2>
            <div className="rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm h-72">
              <iframe
                title="Siksha Wallah Location"
                src="https://maps.google.com/maps?q=College+Chowk+Forbesganj+Araria+Bihar&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-4 text-center">
              <a
                href="https://maps.google.com/?q=College+Chowk+Forbesganj+Araria+Bihar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#003f9f] px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition"
              >
                Open in Google Maps <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
