"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, Trophy, Flame, PlayCircle, Loader2 } from "lucide-react";
import type { Routine } from "@/types/schema";

export default function ClientDashboard() {
  const { gymId } = useParams() as { gymId: string };
  const { user } = useAuth();
  
  const [latestRoutine, setLatestRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(true);

  const stats = [
    { title: "Entrenamientos mes", value: "12", icon: Activity, trend: "+2 vs mes pasado" },
    { title: "Puntos Gymrat", value: "450", icon: Trophy, trend: "Nivel 3" },
    { title: "Racha actual", value: "3 días", icon: Flame, trend: "¡Sigue así!" },
  ];

  useEffect(() => {
    if (!user || !gymId) return;
    const fetchLatest = async () => {
      try {
        const q = query(
          collection(db, "routines"),
          where("gymId", "==", gymId),
          where("clientId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Routine));
        
        // Manual sort (simulating orderBy since index might not exist)
        data.sort((a, b) => b.schedule.startDate - a.schedule.startDate);
        if (data.length > 0) setLatestRoutine(data[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, [user, gymId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Panel General</h1>
        <p className="text-muted-foreground">Tu resumen rápido de actividad. Ve a "Mis Rutinas" para entrenar.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
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
        <Card className="col-span-4 bg-sidebar/50 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" />
              Rutina Activa
            </CardTitle>
            <CardDescription>El último entrenamiento asignado o generado.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-32 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : latestRoutine ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <h3 className="font-bold text-lg">{latestRoutine.name}</h3>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Hoy</span>
                </div>
                <div className="space-y-2">
                  {latestRoutine.exercises.slice(0, 3).map((ex, i) => (
                    <div key={i} className="flex justify-between text-sm items-center p-2 rounded bg-background border border-border">
                      <span className="capitalize">{ex.exerciseId.replace(/-/g, ' ')}</span>
                      <span className="text-muted-foreground">{ex.sets}x{ex.reps}</span>
                    </div>
                  ))}
                  {latestRoutine.exercises.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">y {latestRoutine.exercises.length - 3} ejercicios más...</p>
                  )}
                </div>
                <button className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90 flex items-center justify-center gap-2 mt-4 transition-all">
                  <PlayCircle className="w-4 h-4" /> Empezar Entrenamiento
                </button>
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-muted-foreground text-sm">
                <p>No hay rutinas activas.</p>
                <p>Ve al menú "Mis Rutinas" y genera una.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Últimos Levantamientos</CardTitle>
            <CardDescription>Tus mejores marcas recientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Sentadilla Libre - 80kg', 'Press de Banca - 60kg', 'Peso Muerto - 100kg'].map((pr, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                  <span className="text-sm">{pr.split(' - ')[0]}</span>
                  <span className="text-sm font-bold text-primary">{pr.split(' - ')[1]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
