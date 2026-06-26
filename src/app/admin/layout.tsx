// Admin layout — shared wrapper for all /admin/* routes.
// NOTE: OfficePresence heartbeat is intentionally NOT here because this layout
// also wraps /admin/login (unauthenticated). Rendering it here causes the
// component to fire a presence ping, get a 401, set stopped=true, and then
// silently skip all subsequent heartbeats even after the user logs in (the
// App Router keeps layouts alive across navigations). Instead, OfficePresence
// lives inside AdminHeader which is only rendered by authenticated pages.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
