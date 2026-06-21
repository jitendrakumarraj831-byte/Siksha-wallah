import { redirect } from "next/navigation";

// The office dashboard lives at /admin/dashboard. Bare /admin just forwards
// there; access is enforced by middleware (signed admin session cookie).
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}
