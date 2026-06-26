"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { useAdminGuard } from "@/hooks/use-admin-guard";
import { Loader, User, Shield, MapPin, Phone, Mail, Building2, Key } from "lucide-react";

export default function AdminProfilePage() {
  const { authorized } = useAdminGuard();
  const guardLoading = authorized === null;
  const [adminUser, setAdminUser] = useState("Admin");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sw_admin_user");
      if (stored) setAdminUser(stored);
    }
  }, []);

  if (guardLoading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader className="animate-spin text-[#003f9f]" size={36} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader adminUser={adminUser} />
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Admin Profile</h1>

        {/* Profile Card */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-[#001f6b] to-[#003f9f] px-6 py-8 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl font-extrabold">
                {adminUser.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Office / Admin</p>
                <h2 className="text-xl font-extrabold mt-0.5">{adminUser}</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <Shield size={12} className="text-green-400" />
                  <span className="text-xs text-green-400 font-semibold">Super Admin — Full Access</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 py-3 border-b border-gray-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                <User size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Username</p>
                <p className="font-semibold text-gray-800">{adminUser}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3 border-b border-gray-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">
                <Building2 size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Organization</p>
                <p className="font-semibold text-gray-800">Siksha Wallah Admission Consultancy</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3 border-b border-gray-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
                <MapPin size={16} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Office Address</p>
                <p className="font-semibold text-gray-800">College Chowk, Near HP Petrol Pump</p>
                <p className="text-sm text-gray-500">Forbesganj, Araria, Bihar — 854318</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3 border-b border-gray-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
                <Phone size={16} className="text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Contact</p>
                <p className="font-semibold text-gray-800">+91 62031 38576 · +91 78580 62498</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                <Mail size={16} className="text-red-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-semibold text-gray-800">admission@sikshawallahfbg.in</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <Key size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-amber-800">Password Change</p>
            <p className="text-amber-700 mt-0.5">
              To change the admin password, update the <code className="bg-amber-100 px-1 rounded text-xs">ADMIN_PASSWORD</code> environment variable on your hosting platform and redeploy. Admin credentials are managed server-side for maximum security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
