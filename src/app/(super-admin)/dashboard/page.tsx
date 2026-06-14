import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Dumbbell, Activity, TrendingUp } from "lucide-react";

export default function SuperAdminDashboard() {
  const stats = [
    { title: "Franquicias Activas", value: "1", icon: Dumbbell, trend: "+1 este mes" },
    { title: "Usuarios Totales", value: "4", icon: Users, trend: "+4 esta semana" },
    { title: "Ingresos (Est)", value: "$450", icon: TrendingUp, trend: "+$450 este mes" },
    { title: "Sesiones Activas", value: "12", icon: Activity, trend: "Normal" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard Principal</h1>
        <p className="text-muted-foreground">Resumen general de la plataforma Gymrat SaaS.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Crecimiento de Gimnasios</CardTitle>
            <CardDescription>
              Aumento de franquicias en los últimos 6 meses.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground border-t border-border mt-4">
            (Gráfico Placeholder)
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Suscripciones Recientes</CardTitle>
            <CardDescription>Nuevos gimnasios añadidos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Gymrat Premium</p>
                  <p className="text-sm text-muted-foreground">
                    admin@gymrat.com
                  </p>
                </div>
                <div className="ml-auto font-medium text-primary">+$150.00</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
