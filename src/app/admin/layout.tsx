import { OfficePresence } from "@/components/office-presence";

// Wraps every /admin/* page. The only thing it adds is the invisible
// OfficePresence heartbeat so the office's "online" status stays fresh for the
// student-side counsellor-online notification.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <OfficePresence />
    </>
  );
}
