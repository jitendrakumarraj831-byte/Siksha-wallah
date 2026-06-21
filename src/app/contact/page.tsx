"use client";

import { useState } from "react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { saveInquiry } from "@/services/inquiry-service";
import { saveActivity } from "@/services/activity-service";
import {
  Phone, MessageCircle, MapPin, Clock, CheckCircle2,
  Send, ArrowRight, Mail, User, AlertCircle,
} from "lucide-react";

const counsellors = [
  {
    name: "Rajesh Kumar Sah",
    role: "Founder & Chief Counsellor",
    phone: "6203138576",
    expertise: "B.Ed, D.El.Ed, BSCC, सभी Courses",
    available: "Mon–Sat: 9AM–6PM",
  },
  {
    name: "Md. Naseem Ansari",
    role: "Nursing & BSCC Specialist",
    phone: "7858062498",
    expertise: "BSCC Loan, Nursing, B.Pharma, GNM, ANM",
    available: "Mon–Sat: 9AM–6PM",
  },
  {
    name: "Medical Admission Helpline",
    role: "Pan-India Medical Admissions",
    phone: "9472813581",
    expertise: "Nursing, B.Pharma, MBBS — पूरे India में",
    available: "Mon–Sat: 9AM–5PM",
  },
  {
    name: "Gautam Kumar",
    role: "Kursakanta Branch — BSCC & Tech",
    phone: "9162653235",
    expertise: "BSCC, B.Tech, BBA, MBA — Kursakanta क्षेत्र",
    available: "Mon–Sat: 9AM–6PM",
  },
];

const officeHours = [
  ["सोमवार – शनिवार", "सुबह 9:00 – शाम 6:00 बजे"],
  ["रविवार", "सुबह 10:00 – दोपहर 2:00 बजे (Emergency only)"],
  ["WhatsApp", "24/7 — कभी भी message करें"],
];

export default function ContactPage() {
  const [form, setForm] = useState({ fullName: "", mobile: "", email: "", course: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      setError("कृपया अपना पूरा नाम लिखें।");
      return;
    }
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile.trim())) {
      setError("कृपया सही 10-अंकों का mobile number लिखें।");
      return;
    }

    setLoading(true);
    try {
      await saveInquiry({
        fullName: form.fullName,
        mobile: form.mobile,
        course: form.course,
        message: form.message,
      });

      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.fullName,
            phone: form.mobile,
            email: form.email,
            course: form.course,
            message: form.message,
          }),
        });
      } catch {
        // Email failure is non-blocking
      }

      saveActivity({
        type: "contact",
        title: "📝 Contact Form Submitted",
        description: `${form.fullName} → ${form.course || "General inquiry"}`,
        name: form.fullName,
        mobile: form.mobile,
        email: form.email,
        course: form.course,
        page: "/contact",
      });

      const waText = `नमस्ते! मेरा नाम ${encodeURIComponent(form.fullName)} है।%0AMobile: ${form.mobile}%0ACourse: ${encodeURIComponent(form.course || "जानकारी चाहिए")}%0A${form.message ? "Message: " + encodeURIComponent(form.message) : ""}`;
      window.open(`https://wa.me/916203138576?text=${waText}`, "_blank");
      setSubmitted(true);
    } catch {
      setError("जमा नहीं हुआ। कृपया सीधे कॉल करें: 6203138576");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SiteNavbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#881337] via-[#be123c] to-[#e11d48] py-16 text-white text-center">
          {/* Abstract wave at bottom */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gray-50" style={{ clipPath: "ellipse(120% 60% at 50% 100%)" }} />
          <div className="container-shell relative">
            <p className="text-sm font-bold uppercase tracking-widest text-rose-200 mb-3">हमसे बात करें</p>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">संपर्क करें</span> — हम यहाँ हैं
            </h1>
            <p className="text-rose-100 max-w-xl mx-auto leading-relaxed">
              Admission inquiry, BSCC loan guidance, या कोई भी सवाल हो — कॉल करें, WhatsApp करें, या नीचे फॉर्म भरें। हमारे काउंसलर <strong className="text-white">30 मिनट में</strong> जवाब देंगे।
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="tel:+916203138576"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-rose-700 hover:bg-rose-50 transition shadow-lg"
              >
                <Phone size={16} /> अभी Call करें
              </a>
              <a
                href="https://wa.me/916203138576?text=नमस्ते! मुझे Admission Counselling चाहिए।"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition backdrop-blur"
              >
                <MessageCircle size={16} /> WhatsApp करें
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container-shell">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">

              {/* LEFT — Contact Info */}
              <div className="space-y-5">

                {/* Office Address */}
                <div className="rounded-2xl bg-white border-2 border-gray-100 p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-rose-700 text-white">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <h3 className="font-headline text-lg font-extrabold text-gray-900">हमारा Office</h3>
                      <p className="mt-1 text-gray-600 font-medium">College Chowk, Near HP Petrol Pump</p>
                      <p className="text-gray-600">Forbesganj, Araria — Bihar 854318</p>
                      <a
                        href="https://maps.google.com/?q=College+Chowk+Forbesganj+Araria+Bihar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-rose-700 hover:underline"
                      >
                        Google Maps पर देखें <ArrowRight size={13} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="rounded-2xl bg-white border-2 border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock size={20} className="text-rose-700" />
                    <h3 className="font-headline text-lg font-extrabold text-gray-900">Office समय</h3>
                  </div>
                  <div className="space-y-2">
                    {officeHours.map(([day, time]) => (
                      <div key={day} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                        <span className="font-semibold text-gray-700">{day}</span>
                        <span className="text-rose-700 font-bold">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Counsellors */}
                <div>
                  <h3 className="font-headline text-lg font-extrabold text-gray-900 mb-3">
                    हमारे Counsellors से बात करें
                  </h3>
                  <div className="space-y-3">
                    {counsellors.map(({ name, role, phone, expertise, available }) => (
                      <a
                        key={phone}
                        href={`tel:+91${phone}`}
                        className="flex items-center gap-4 rounded-2xl bg-rose-50 border-2 border-rose-100 p-4 shadow-sm hover:border-rose-400 hover:shadow-md transition group"
                      >
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#003f9f] to-[#0060c7] font-headline font-extrabold text-lg text-white">
                          {name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">{name}</p>
                          <p className="text-xs text-rose-700 font-semibold">{role}</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{expertise}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-gray-900 text-sm group-hover:text-rose-700 transition">+91 {phone}</p>
                          <span className="text-xs text-green-600 font-semibold">● Call करें</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/916203138576?text=नमस्ते! मुझे Siksha Wallah से Admission Counselling चाहिए। कृपया guide करें।"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 rounded-2xl bg-green-500 px-6 py-4 font-extrabold text-white hover:bg-green-600 transition shadow-lg shadow-green-500/20"
                >
                  <MessageCircle size={22} fill="currentColor" /> WhatsApp पर Chat करें (24/7)
                </a>
              </div>

              {/* RIGHT — Contact Form */}
              <div className="rounded-2xl bg-white border-t-4 border-rose-500 border-x-2 border-b-2 border-x-gray-100 border-b-gray-100 p-8 shadow-sm">
                {submitted ? (
                  <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 size={56} className="text-green-500" />
                    </div>
                    <h3 className="font-headline text-2xl font-extrabold text-gray-900">
                      आपकी Inquiry मिल गई! 🎉
                    </h3>
                    <p className="text-gray-500 max-w-xs leading-relaxed">
                      हमारे काउंसलर <strong className="text-gray-800">30 मिनट में</strong> आपको WhatsApp या कॉल करेंगे। साथ ही WhatsApp पर message भी भेज दिया गया है।
                    </p>
                    <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-semibold">
                      ✅ आवेदन सफलतापूर्वक सुरक्षित हो गया
                    </div>
                    <div className="flex gap-3 mt-2">
                      <a
                        href="tel:+916203138576"
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-rose-800 transition"
                      >
                        <Phone size={15} /> अभी Call करें
                      </a>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setForm({ fullName: "", mobile: "", email: "", course: "", message: "" });
                        }}
                        className="rounded-xl border-2 border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 hover:border-gray-300 transition"
                      >
                        नई Inquiry भेजें
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h2 className="font-headline text-2xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                        निःशुल्क परामर्श के लिए संदेश भेजें
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">
                        नीचे फॉर्म भरें — हमारे विशेषज्ञ <strong className="text-gray-700">30 मिनट में</strong> संपर्क करेंगे।
                      </p>
                    </div>

                    {error && (
                      <div className="mb-5 flex gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                        <p>{error}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                      <div>
                        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-semibold text-gray-700">
                          आपका पूरा नाम *
                        </label>
                        <div className="relative">
                          <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                          <input
                            id="contact-name"
                            required
                            value={form.fullName}
                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                            placeholder="जैसे: Rahul Kumar"
                            className="w-full rounded-xl border-2 border-gray-200 pl-10 pr-4 py-3.5 text-sm outline-none focus:border-rose-500 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contact-mobile" className="mb-1.5 block text-sm font-semibold text-gray-700">
                          मोबाइल नंबर *
                        </label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                          <input
                            id="contact-mobile"
                            required
                            type="tel"
                            maxLength={10}
                            value={form.mobile}
                            onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") })}
                            placeholder="10-अंकों का mobile number"
                            className="w-full rounded-xl border-2 border-gray-200 pl-10 pr-4 py-3.5 text-sm outline-none focus:border-rose-500 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-semibold text-gray-700">
                          Email (वैकल्पिक)
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                          <input
                            id="contact-email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="your@email.com"
                            className="w-full rounded-xl border-2 border-gray-200 pl-10 pr-4 py-3.5 text-sm outline-none focus:border-rose-500 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contact-course" className="mb-1.5 block text-sm font-semibold text-gray-700">
                          किस Course में रुचि है?
                        </label>
                        <select
                          id="contact-course"
                          value={form.course}
                          onChange={(e) => setForm({ ...form, course: e.target.value })}
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm text-gray-700 outline-none focus:border-rose-500 bg-white transition"
                        >
                          <option value="">-- Course चुनें --</option>
                          <optgroup label="🎓 Teaching">
                            <option>B.Ed</option><option>D.El.Ed</option><option>M.Ed</option>
                          </optgroup>
                          <optgroup label="🏥 Medical & Nursing">
                            <option>MBBS</option><option>BDS</option><option>B.Sc Nursing</option>
                            <option>GNM</option><option>ANM</option><option>B.Pharma</option>
                          </optgroup>
                          <optgroup label="💻 Technical & Management">
                            <option>B.Tech</option><option>Polytechnic</option><option>ITI</option>
                            <option>BCA</option><option>MCA</option><option>BBA</option><option>MBA</option>
                          </optgroup>
                          <option>BSCC Loan Guidance</option>
                          <option>अभी decide नहीं किया — guidance चाहिए</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold text-gray-700">
                          आपका सवाल या message (वैकल्पिक)
                        </label>
                        <textarea
                          id="contact-message"
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          rows={3}
                          placeholder="जैसे: मेरे 12th में 65% हैं, B.Ed के लिए eligible हूँ क्या?"
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-rose-500 transition resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-700 py-4 font-extrabold text-white hover:bg-rose-800 transition disabled:opacity-60 shadow-lg shadow-rose-200 active:scale-95"
                      >
                        {loading ? (
                          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                          <><Send size={18} /> संदेश भेजें</>
                        )}
                      </button>
                      <p className="text-center text-xs text-gray-400">
                        100% Free • कोई spam नहीं • आपकी जानकारी सुरक्षित है
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Google Maps */}
        <section className="bg-white pb-16">
          <div className="container-shell">
            <h2 className="font-headline text-xl font-bold text-gray-800 mb-4 text-center">
              हमारा Location — College Chowk, Forbesganj
            </h2>
            <div className="rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm h-72">
              <iframe
                title="Siksha Wallah — College Chowk Forbesganj Location"
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
                className="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-rose-800 transition shadow"
              >
                Google Maps पर खोलें <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
