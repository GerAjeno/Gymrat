export default async function GymAdminDashboard({ params }: { params: Promise<{ gymId: string }> }) {
  const { gymId } = await params;
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Gym Dashboard</h1>
      <p className="text-muted-foreground">Managing Gym ID: {gymId}</p>
    </div>
  );
}
