"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar as CalendarIcon, CheckCircle2, Dumbbell } from "lucide-react";

const daysOfWeek = [
  { id: 1, name: "Lunes" },
  { id: 2, name: "Martes" },
  { id: 3, name: "Miércoles" },
  { id: 4, name: "Jueves" },
  { id: 5, name: "Viernes" },
  { id: 6, name: "Sábado" },
  { id: 0, name: "Domingo" },
];

export default function CalendarPage() {
  const { gymId } = useParams() as { gymId: string };
  const { user } = useAuth();
  
  const [scheduledDays, setScheduledDays] = useState<number[]>([]);
  
  useEffect(() => {
    if (!user || !gymId) return;
    
    const fetchLatestRoutine = async () => {
      const q = query(
        collection(db, "routines"),
        where("gymId", "==", gymId),
        where("clientId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      if (data.length > 0) {
        // Just grab the latest one
        data.sort((a, b) => b.schedule.startDate - a.schedule.startDate);
        setScheduledDays(data[0].schedule.weeklyDays || [1,3,5]); // Default L-X-V
      }
    };
    fetchLatestRoutine();
  }, [user, gymId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Calendario Semanal</h1>
        <p className="text-muted-foreground">Tu programación de entrenamientos basados en tu rutina activa.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarIcon className="w-5 h-5" /> Agenda de la Semana</CardTitle>
          <CardDescription>
            Los días marcados corresponden a tu programa de entrenamiento de la IA.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {daysOfWeek.map(day => {
              const isTrainingDay = scheduledDays.includes(day.id);
              
              return (
                <div 
                  key={day.id} 
                  className={`p-4 rounded-lg border flex flex-col items-center justify-center h-32 transition-all ${
                    isTrainingDay 
                      ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,209,255,0.1)]' 
                      : 'border-border bg-sidebar/30 opacity-50'
                  }`}
                >
                  <h3 className={`font-bold mb-2 ${isTrainingDay ? 'text-primary' : 'text-muted-foreground'}`}>
                    {day.name}
                  </h3>
                  
                  {isTrainingDay ? (
                    <div className="flex flex-col items-center">
                      <Dumbbell className="w-6 h-6 text-primary mb-1" />
                      <span className="text-xs text-primary font-medium">Entrenamiento</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Descanso</span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
