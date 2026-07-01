// ─────────────────────────────────────────────────────────────────────────────
// Siksha Wallah — Shared Admission-Journey "brain".
//
// This is the single source of truth that makes the Student Portal and the
// Office Portal feel like ONE connected Admission CRM. Both portals derive every
// status, next-step, document state and "what to do today" answer from the
// functions here — so the two sides can never tell a student two different
// stories about the same application.
//
// It is intentionally PURE logic (no JSX, no API calls, no Firebase) so it can be
// reused on the server and the client, in both portals, without coupling. It only
// reads data the existing APIs already return (a `CourseApplication` plus the
// student's uploaded document), so NOTHING about the APIs, services or Firestore
// changes.
//
// Student questions it answers:   What is my status? · My next step? · Which
//   documents are pending? · What's already done? · What should I do today?
// Office questions it answers:     Who needs action today? · Which follow-ups are
//   pending? · Which documents need verification? · Which admissions are waiting?
//   · Which students are fully completed?
// ─────────────────────────────────────────────────────────────────────────────

import type { CourseApplication, ApplicationStatus } from "@/services/application-service";
import { receiptNo } from "@/lib/receipt";

/* ── Canonical admission timeline ─────────────────────────────────────────────
   ONE timeline, shown identically in both portals. The four happy-path stages
   map 1:1 onto the existing application status values; `not_interested` is a
   closed branch handled separately. */
export const JOURNEY_STAGES = [
  { key: "new",               label: "Application Received", short: "Received",   desc: "We have received your application." },
  { key: "contacted",         label: "Counsellor Connected", short: "Counselling", desc: "A counsellor has connected with you." },
  { key: "documents_pending", label: "Document Verification", short: "Documents",  desc: "Your documents are being verified." },
  { key: "admission_done",    label: "Admission Confirmed",  short: "Confirmed",  desc: "Your admission is confirmed." },
] as const;

export type StageKey = (typeof JOURNEY_STAGES)[number]["key"];

/** Semantic colour tone — components map this to their own classes/branding. */
export type Tone = "info" | "active" | "warn" | "success" | "muted";

/* ── Shared status metadata (deduped) ─────────────────────────────────────────
   Previously every page declared its own STATUS_META map with slightly different
   labels. One map here keeps student and office wording in sync. */
export const APP_STATUS_META: Record<ApplicationStatus, { label: string; tone: Tone; icon: string }> = {
  new:               { label: "Application Received", tone: "info",    icon: "received" },
  contacted:         { label: "Counsellor Connected", tone: "active",  icon: "phone" },
  documents_pending: { label: "Documents Required",   tone: "warn",    icon: "doc" },
  admission_done:    { label: "Admission Confirmed",  tone: "success", icon: "check" },
  not_interested:    { label: "Application Closed",   tone: "muted",   icon: "x" },
};

/** Index of the application's stage on the canonical timeline. Closed → -1. */
export function stageIndex(status?: ApplicationStatus): number {
  if (status === "not_interested") return -1;
  const i = JOURNEY_STAGES.findIndex((s) => s.key === (status || "new"));
  return i < 0 ? 0 : i;
}

/* ── Document state ───────────────────────────────────────────────────────────
   Derived from the student's uploaded combined PDF (or none). Mirrors the
   existing `documents` collection `status` field without changing it. */
export type DocStatus = "pending" | "approved" | "rejected";
export type DocState = "none" | DocStatus;

export interface DocLike {
  status?: DocStatus;
  name?: string;
  type?: string;
  uploadedAt?: number;
}

const COMBINED_TYPE = "all_documents";

/** Pick the document that represents a student's verification state: prefer the
 *  combined PDF, else the most recently uploaded file. */
export function representativeDoc(docs?: DocLike[] | null): DocLike | undefined {
  if (!docs || docs.length === 0) return undefined;
  const combined = docs.find((d) => d.type === COMBINED_TYPE);
  if (combined) return combined;
  return [...docs].sort((a, b) => (b.uploadedAt ?? 0) - (a.uploadedAt ?? 0))[0];
}

export function docState(doc?: DocLike): DocState {
  if (!doc) return "none";
  return doc.status || "pending";
}

export interface DocSummary {
  state: DocState;
  label: string;
  hint: string;
  tone: Tone;
  /** true while the office still needs to look at it (drives the office queue). */
  awaitingOffice: boolean;
  /** true while the student still has something to upload/fix. */
  awaitingStudent: boolean;
}

export function summarizeDocuments(doc?: DocLike): DocSummary {
  switch (docState(doc)) {
    case "approved":
      return { state: "approved", label: "Documents approved", hint: "All your documents are verified.", tone: "success", awaitingOffice: false, awaitingStudent: false };
    case "pending":
      return { state: "pending", label: "Under review", hint: "Your document is with the office for verification.", tone: "active", awaitingOffice: true, awaitingStudent: false };
    case "rejected":
      return { state: "rejected", label: "Re-upload needed", hint: "Your document was rejected — please upload a corrected copy.", tone: "warn", awaitingOffice: false, awaitingStudent: true };
    default:
      return { state: "none", label: "Not uploaded", hint: "Combine your documents into one PDF and upload it.", tone: "warn", awaitingOffice: false, awaitingStudent: true };
  }
}

/* ── Student journey ──────────────────────────────────────────────────────────
   Everything the student dashboard needs to answer the five student questions
   for a single application. */
export interface JourneyAction {
  title: string;
  detail: string;
  /** Optional one-tap action so the student/counsellor never hunts for it. */
  cta?: { label: string; href: string; kind: "primary" | "upload" | "receipt" | "chat" };
  tone: Tone;
}

export interface StudentJourney {
  receipt: string;
  course: string;
  status: ApplicationStatus;
  statusLabel: string;
  tone: Tone;
  isClosed: boolean;
  isComplete: boolean;
  stage: number;                 // index on JOURNEY_STAGES, -1 when closed
  percent: number;               // 0..100 progress along the timeline
  completed: string[];           // labels of stages already done
  documents: DocSummary;
  nextStep: JourneyAction;       // "What is my next step?"
  todayAction: JourneyAction;    // "What should I do today?"
}

export function computeJourney(app: CourseApplication, doc?: DocLike): StudentJourney {
  const status = (app.status || "new") as ApplicationStatus;
  const meta = APP_STATUS_META[status];
  const idx = stageIndex(status);
  const isClosed = status === "not_interested";
  const isComplete = status === "admission_done";
  const documents = summarizeDocuments(doc);

  const completed = isClosed
    ? []
    : JOURNEY_STAGES.slice(0, idx + (isComplete ? 1 : 0)).map((s) => s.label);

  const percent = isClosed
    ? 0
    : Math.round(((idx + (isComplete ? 1 : 0)) / JOURNEY_STAGES.length) * 100);

  const nextStep = computeNextStep(status, documents);
  // "Today" is the most pressing thing the student can act on right now. When the
  // next step is something they DO (upload / chat / download), it is today's
  // action; when they are waiting on us, today's action reassures + offers chat.
  const todayAction: JourneyAction = nextStep.cta
    ? nextStep
    : {
        title: "Nothing needed from you today",
        detail: nextStep.detail,
        tone: "info",
        cta: { label: "Message Counsellor", href: "/dashboard/messages", kind: "chat" },
      };

  return {
    receipt: receiptNo(app.id),
    course: app.course,
    status,
    statusLabel: meta.label,
    tone: meta.tone,
    isClosed,
    isComplete,
    stage: idx,
    percent,
    completed,
    documents,
    nextStep,
    todayAction,
  };
}

function computeNextStep(status: ApplicationStatus, documents: DocSummary): JourneyAction {
  if (status === "not_interested") {
    return { title: "Application closed", detail: "This application is no longer active. Apply again any time.", tone: "muted",
      cta: { label: "Browse Courses", href: "/courses", kind: "primary" } };
  }
  if (status === "admission_done") {
    return { title: "Admission confirmed 🎉", detail: "Congratulations! Download your application receipt for your records.", tone: "success",
      cta: { label: "Download Receipt", href: "#receipt", kind: "receipt" } };
  }
  if (status === "documents_pending") {
    if (documents.state === "none")
      return { title: "Upload your documents", detail: "Combine all documents into one PDF (max 2 MB) and upload to continue.", tone: "warn",
        cta: { label: "Upload Documents", href: "/dashboard/documents", kind: "upload" } };
    if (documents.state === "rejected")
      return { title: "Re-upload your documents", detail: "Your document was rejected. Upload a corrected, clearer copy.", tone: "warn",
        cta: { label: "Re-upload Documents", href: "/dashboard/documents", kind: "upload" } };
    if (documents.state === "pending")
      return { title: "Documents under review", detail: "Your office team is verifying your documents (usually 1–2 working days).", tone: "active" };
    return { title: "Documents approved", detail: "Your documents are verified. The office will confirm your admission shortly.", tone: "success" };
  }
  if (status === "contacted") {
    if (documents.state === "none")
      return { title: "Keep your documents ready", detail: "Your counsellor is guiding you. Upload your documents PDF to speed things up.", tone: "active",
        cta: { label: "Upload Documents", href: "/dashboard/documents", kind: "upload" } };
    return { title: "Counsellor is assisting you", detail: "Stay in touch with your counsellor for the next steps.", tone: "active",
      cta: { label: "Message Counsellor", href: "/dashboard/messages", kind: "chat" } };
  }
  // new / default
  return { title: "Counsellor will call you shortly", detail: "We usually connect within 30 minutes during office hours (Mon–Sat, 9AM–7PM).", tone: "info" };
}

/* ── Office triage ────────────────────────────────────────────────────────────
   The office dashboard groups applications into action buckets that answer the
   five office questions. Priority order is the order a counsellor should work:
   verify documents first (a student is blocked), then new leads, then admissions
   ready to confirm, then follow-ups, then the done/closed records. */
export type OfficeBucket =
  | "verify_docs"        // a document is waiting for office verification
  | "needs_action"       // brand-new application, not yet contacted
  | "admission_waiting"  // documents approved, ready to confirm admission
  | "follow_up"          // counsellor needs to chase the student
  | "completed"          // admission done
  | "closed";            // not interested

export const OFFICE_BUCKET_META: Record<OfficeBucket, { label: string; question: string; tone: Tone; icon: string }> = {
  verify_docs:       { label: "Documents to verify",   question: "Which documents need verification?", tone: "warn",    icon: "doc" },
  needs_action:      { label: "Needs action today",    question: "Which students need action today?",  tone: "active",  icon: "phone" },
  admission_waiting: { label: "Admissions waiting",    question: "Which admissions are waiting?",       tone: "info",    icon: "clock" },
  follow_up:         { label: "Follow-ups pending",    question: "Which follow-ups are pending?",       tone: "active",  icon: "repeat" },
  completed:         { label: "Completed",             question: "Which students are fully completed?", tone: "success", icon: "check" },
  closed:            { label: "Closed",                question: "",                                     tone: "muted",   icon: "x" },
};

/** Ordered list of the buckets the office should work through, top to bottom. */
export const OFFICE_BUCKET_ORDER: OfficeBucket[] = [
  "verify_docs", "needs_action", "admission_waiting", "follow_up", "completed",
];

export interface OfficeTriage {
  bucket: OfficeBucket;
  reason: string;
  receipt: string;
  docState: DocState;
}

export function triageApplication(app: CourseApplication, doc?: DocLike): OfficeTriage {
  const status = (app.status || "new") as ApplicationStatus;
  const ds = docState(doc);
  const receipt = receiptNo(app.id);

  // A document waiting for review blocks the student — always surface it first,
  // regardless of the application's own status.
  if (ds === "pending")
    return { bucket: "verify_docs", reason: "Uploaded document awaiting verification", receipt, docState: ds };

  if (status === "not_interested")
    return { bucket: "closed", reason: "Marked not interested", receipt, docState: ds };

  if (status === "admission_done")
    return { bucket: "completed", reason: "Admission confirmed", receipt, docState: ds };

  if (status === "new" || !app.status)
    return { bucket: "needs_action", reason: "New application — not contacted yet", receipt, docState: ds };

  if (status === "documents_pending" && ds === "approved")
    return { bucket: "admission_waiting", reason: "Documents approved — ready to confirm admission", receipt, docState: ds };

  if (status === "documents_pending")
    return {
      bucket: "follow_up",
      reason: ds === "rejected" ? "Document rejected — student must re-upload" : "Waiting on student to upload documents",
      receipt, docState: ds,
    };

  // contacted (and any other in-progress state)
  return { bucket: "follow_up", reason: "Contacted — needs follow-up", receipt, docState: ds };
}

export interface OfficeApplicationRow {
  app: CourseApplication;
  triage: OfficeTriage;
}

export interface OfficeSummary {
  counts: Record<OfficeBucket, number>;
  rows: Record<OfficeBucket, OfficeApplicationRow[]>;
  /** total items that need a human to do something today */
  actionableToday: number;
}

/** Group every application into its office bucket, attaching the student's
 *  representative document state. `docsByUser` maps a Firebase UID → that
 *  student's documents (as returned by /api/admin/data?type=documents). */
export function summarizeOffice(
  apps: CourseApplication[],
  docsByUser: Record<string, DocLike[]>,
): OfficeSummary {
  const counts = { verify_docs: 0, needs_action: 0, admission_waiting: 0, follow_up: 0, completed: 0, closed: 0 } as Record<OfficeBucket, number>;
  const rows = { verify_docs: [], needs_action: [], admission_waiting: [], follow_up: [], completed: [], closed: [] } as Record<OfficeBucket, OfficeApplicationRow[]>;

  for (const app of apps) {
    const docs = app.userId ? docsByUser[app.userId] : undefined;
    const triage = triageApplication(app, representativeDoc(docs));
    counts[triage.bucket] += 1;
    rows[triage.bucket].push({ app, triage });
  }

  const actionableToday = counts.verify_docs + counts.needs_action + counts.admission_waiting + counts.follow_up;
  return { counts, rows, actionableToday };
}
