// Shared application "receipt" helpers used by both the student portal and the
// office portal so the same human-readable reference number is shown everywhere,
// and a student can download/print a professional receipt of their application.
//
// No backend, no new dependency: the receipt number is DERIVED from the existing
// Firestore document id (no schema change), and the printable receipt is rendered
// client-side in a new window so the browser's native "Save as PDF" produces the
// file.

import type { CourseApplication, ApplicationStatus } from "@/services/application-service";

/** Stable, human-friendly receipt number derived from the application id. */
export function receiptNo(id?: string): string {
  if (!id) return "SW-PENDING";
  return `SW-${id.slice(0, 8).toUpperCase()}`;
}

/** The four happy-path stages an application moves through. */
export const TIMELINE_STEPS: { status: ApplicationStatus; label: string }[] = [
  { status: "new", label: "Application Received" },
  { status: "contacted", label: "Counsellor Connected" },
  { status: "documents_pending", label: "Document Verification" },
  { status: "admission_done", label: "Admission Confirmed" },
];

/** Index of the current stage in TIMELINE_STEPS. `new`/undefined → 0; closed → -1. */
export function timelineStep(status?: ApplicationStatus): number {
  if (status === "not_interested") return -1;
  const i = TIMELINE_STEPS.findIndex((s) => s.status === (status || "new"));
  return i < 0 ? 0 : i;
}

function toMillis(ts: unknown): number | null {
  if (typeof ts === "number") return ts;
  if (ts && typeof (ts as any).toMillis === "function") return (ts as any).toMillis();
  if (ts) {
    const t = new Date(ts as any).getTime();
    if (!Number.isNaN(t)) return t;
  }
  return null;
}

export function formatReceiptDate(ts: unknown): string {
  const ms = toMillis(ts);
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

// Escape user-provided values before injecting into the receipt HTML.
function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  new: "Application Received",
  contacted: "Counsellor Connected",
  documents_pending: "Documents Required",
  admission_done: "Admission Confirmed",
  not_interested: "Application Closed",
};

function buildReceiptHtml(app: CourseApplication): string {
  const rno = receiptNo(app.id);
  const status = (app.status || "new") as ApplicationStatus;
  const stepIdx = timelineStep(status);
  const closed = status === "not_interested";

  const row = (k: string, v?: string) =>
    v ? `<tr><td class="k">${esc(k)}</td><td class="v">${esc(v)}</td></tr>` : "";

  const steps = TIMELINE_STEPS.map((s, i) => {
    const done = !closed && i <= stepIdx;
    const current = !closed && i === stepIdx;
    return `<li class="${done ? "done" : ""} ${current ? "current" : ""}">
      <span class="dot">${done ? "✓" : i + 1}</span>
      <span class="lbl">${esc(s.label)}</span>
    </li>`;
  }).join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(rno)} — Siksha Wallah Application Receipt</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #0f172a; margin: 0; background: #f1f5f9; }
  .sheet { max-width: 720px; margin: 24px auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
  .head { background: linear-gradient(135deg,#00102e,#003f9f); color: #fff; padding: 24px 28px; }
  .brand { font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: #fcd34d; font-weight: 700; }
  .title { font-size: 22px; font-weight: 800; margin: 2px 0 0; }
  .sub { font-size: 12px; color: #bfdbfe; margin-top: 4px; }
  .rno { margin-top: 14px; display: inline-block; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.25);
         padding: 8px 14px; border-radius: 10px; }
  .rno b { font-size: 20px; letter-spacing: .06em; }
  .body { padding: 24px 28px; }
  .badge { display: inline-block; padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; }
  .b-done { background: #dcfce7; color: #166534; } .b-mid { background: #fef9c3; color: #854d0e; }
  .b-closed { background: #f1f5f9; color: #475569; }
  h2 { font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: #003f9f; margin: 22px 0 8px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 6px 0; font-size: 13px; vertical-align: top; }
  td.k { color: #64748b; width: 40%; } td.v { font-weight: 600; }
  ol.timeline { list-style: none; padding: 0; margin: 6px 0 0; }
  ol.timeline li { display: flex; align-items: center; gap: 12px; padding: 8px 0; color: #94a3b8; }
  ol.timeline li .dot { width: 26px; height: 26px; border-radius: 999px; background: #e2e8f0; color: #64748b;
        display: grid; place-items: center; font-size: 12px; font-weight: 700; flex: 0 0 auto; }
  ol.timeline li.done { color: #0f172a; } ol.timeline li.done .dot { background: #16a34a; color: #fff; }
  ol.timeline li.current .lbl { font-weight: 800; color: #003f9f; }
  .note { margin-top: 18px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 12px 14px; font-size: 13px; color: #92400e; }
  .office { margin-top: 18px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #1e3a8a; }
  .foot { padding: 16px 28px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #94a3b8; text-align: center; }
  .actions { text-align: center; margin: 16px; }
  .actions button { background: #003f9f; color: #fff; border: 0; padding: 11px 22px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; }
  @media print { body { background: #fff; } .sheet { border: 0; margin: 0; max-width: none; } .actions { display: none; } }
</style></head>
<body>
  <div class="actions"><button onclick="window.print()">⬇ Download / Print Receipt</button></div>
  <div class="sheet">
    <div class="head">
      <div class="brand">Siksha Wallah Consultancy</div>
      <div class="title">Admission Application Receipt</div>
      <div class="sub">Session 2026–27 · College Chowk, Forbesganj, Araria (Bihar)</div>
      <div class="rno"><span style="font-size:11px;color:#bfdbfe;display:block;">Receipt Number</span><b>${esc(rno)}</b></div>
    </div>
    <div class="body">
      <span class="badge ${closed ? "b-closed" : status === "admission_done" ? "b-done" : "b-mid"}">${esc(STATUS_LABEL[status])}</span>

      <h2>Applicant Details</h2>
      <table>
        ${row("Full Name", app.fullName)}
        ${row("Father's Name", app.fatherName)}
        ${row("Mobile", app.mobile ? `+91 ${app.mobile}` : "")}
        ${row("Email", app.email)}
        ${row("District / State", [app.district, app.state].filter(Boolean).join(", "))}
      </table>

      <h2>Course & Qualification</h2>
      <table>
        ${row("Course Applied", app.course)}
        ${row("Qualification", app.qualification)}
        ${row("Passing Year", app.passingYear)}
        ${row("BSCC Loan", app.bsccRequired ? "Requested" : undefined)}
        ${row("Applied On", formatReceiptDate(app.createdAt))}
      </table>

      <h2>Application Timeline</h2>
      ${closed
        ? `<p style="color:#475569;font-size:13px;">This application has been closed. Please contact the office for details.</p>`
        : `<ol class="timeline">${steps}</ol>`}

      ${app.note ? `<div class="note"><b>Counsellor Note:</b> ${esc(app.note)}</div>` : ""}

      <div class="office">
        <b>📍 Office:</b> College Chowk, Near HP Petrol Pump, Forbesganj, Araria, Bihar — 854318<br/>
        <b>⏰ Mon–Sat:</b> 9:00 AM – 7:00 PM &nbsp;·&nbsp; <b>☎</b> +91 62031 38576
      </div>
    </div>
    <div class="foot">
      This is a computer-generated receipt and does not require a signature. Keep your receipt number (${esc(rno)}) for all future correspondence.
    </div>
  </div>
  <script>window.onload = function(){ setTimeout(function(){ try { window.print(); } catch(e){} }, 350); };</script>
</body></html>`;
}

/** Open a printable receipt in a new window (user saves it as PDF). */
export function downloadApplicationReceipt(app: CourseApplication): void {
  const html = buildReceiptHtml(app);
  const w = window.open("", "_blank", "width=820,height=900");
  if (!w) {
    alert("Please allow pop-ups for this site to download your receipt.");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.focus();
}
