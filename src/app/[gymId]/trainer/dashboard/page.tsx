import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, TrendingUp, Bell } from "lucide-react";

export default function TrainerDashboard() {
  const stats = [
    { title: "Clientes Activos", value: "24", icon: Users, trend: "+3 esta semana" },
    { title: "Rutinas Diseñadas", value: "89", icon: FileText, trend: "12 este mes" },
    { title: "Progreso Promedio", value: "15%", icon: TrendingUp, trend: "Aumento de fuerza" },
    { title: "Mensajes Nuevos", value: "5", icon: Bell, trend: "Requieren atención" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Panel de Entrenador</h1>
        <p className="text-muted-foreground">Resumen general de tus clientes asignados.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Últimas Actualizaciones de Clientes</CardTitle>
            <CardDescription>Actividad reciente de los clientes bajo tu supervisión.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t border-border mt-4">
            <p className="text-muted-foreground">No hay actualizaciones recientes.</p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Revisiones Pendientes</CardTitle>
            <CardDescription>Rutinas que requieren actualización.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Todos tus clientes están al día con sus rutinas.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
