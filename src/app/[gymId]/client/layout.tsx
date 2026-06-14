import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default async function ClientLayout({ children, params }: { children: React.ReactNode, params: Promise<{gymId: string}> }) {
  const { gymId } = await params;
  return <DashboardLayout gymId={gymId} role="client">{children}</DashboardLayout>;
}
