import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout gymId="super-admin" role="super_admin">{children}</DashboardLayout>;
}
