import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function TrainerClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Mis Clientes</h1>
        <p className="text-muted-foreground">Administra las rutinas y el progreso de los clientes asignados a ti.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Directorio de Clientes</CardTitle>
          <CardDescription>
            Lista de todos los usuarios que dependen de tu plan de entrenamiento.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex flex-col items-center justify-center border-t border-border mt-4">
          <p className="text-muted-foreground">Funcionalidad de tabla en construcción.</p>
          <p className="text-xs text-muted-foreground mt-2">
            (Aquí conectaremos la lectura de Firebase para listar a los clientes y permitirte hacer clic para asignar rutinas manualmente)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
