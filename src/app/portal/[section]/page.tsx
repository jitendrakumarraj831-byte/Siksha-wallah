import { use } from "react";
import { notFound } from "next/navigation";
import { PortalShell } from "@/components/portal-shell";

// Legal/policy pages only. The site footer links here for Privacy Policy and
// Terms. (Earlier course/college/admission/counselling prototype sections that
// duplicated the real /courses, /apply and /contact pages — with off-brand
// styling and placeholder data — were removed.)

const POLICIES: Record<string, string> = {
  privacy: "Privacy Policy",
  terms: "Terms & Conditions",
  refund: "Refund Policy",
};

function Hero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="bg-[#07152f] py-16 text-white">
      <div className="container-shell">
        <p className="text-sm font-extrabold uppercase tracking-[.2em] text-[#67c8ff]">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-extrabold sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{text}</p>
      </div>
    </section>
  );
}

export default function PortalSection({ params }: { params: Promise<{ section: string }> }) {
  const { section } = use(params);
  const title = POLICIES[section];
  if (!title) notFound();

  return (
    <PortalShell>
      <Hero
        eyebrow="Policies"
        title={title}
        text="Clear information about how Siksha Wallah handles its services, communication and student information."
      />
      <section className="container-shell py-14">
        <article className="prose prose-slate max-w-none rounded-2xl border bg-white p-7 sm:p-10">
          <h2>Policy overview</h2>
          <p>We collect only the information needed to provide counselling and admission support. Student details are handled carefully and are not sold to third parties.</p>
          <h2>Service information</h2>
          <p>Course, fee, recognition and admission information may change. Students should verify final details in official institution documents before payment or enrolment.</p>
          <h2>Payments and refunds</h2>
          <p>Any service fee, payment schedule and refund eligibility must be confirmed in writing before payment. Third-party college or university fees follow the respective institution&rsquo;s policy.</p>
          <h2>Contact</h2>
          <p>For questions, call +91 62031 38576 or visit College Chowk, Forbesganj.</p>
        </article>
      </section>
    </PortalShell>
  );
}
