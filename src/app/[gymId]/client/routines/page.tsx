"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Loader2, Calendar, Sparkles, Save, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { workoutModel } from "@/lib/firebase/ai";
import { ExerciseModal } from "@/components/exercises/ExerciseModal";
import type { Routine } from "@/types/schema";

interface ExerciseAI {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  tips: string;
}

export default function RoutinesPage() {
  const { gymId } = useParams() as { gymId: string };
  const { user } = useAuth();
  
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  // AI State
  const [routineAI, setRoutineAI] = useState<ExerciseAI[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");
  
  // Modal state
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user || !gymId) return;
    fetchRoutines();
  }, [user, gymId]);

  const fetchRoutines = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "routines"), where("gymId", "==", gymId), where("clientId", "==", user?.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Routine));
      data.sort((a, b) => b.schedule.startDate - a.schedule.startDate);
      setRoutines(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsSaved(false);
    setError("");
    try {
      const prompt = "Genera una rutina de cuerpo completo para un cliente principiante-intermedio. Incluye 5 ejercicios clave.";
      const result = await workoutModel.generateContent(prompt);
      const data = JSON.parse(await result.response.text());
      setRoutineAI(data);
    } catch (err: any) {
      console.error(err);
      setError("Error generando la rutina. Inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRoutine = async () => {
    if (!routineAI || !user || !gymId) return;
    setIsSaving(true);
    try {
      const newRoutine = {
        gymId,
        clientId: user.uid,
        trainerId: "unassigned",
        generatedByAI: true,
        name: `Rutina IA - ${new Date().toLocaleDateString()}`,
        schedule: {
          startDate: Date.now(),
          weeklyDays: [1, 3, 5],
        },
        exercises: routineAI.map(ex => ({
          exerciseId: ex.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          sets: ex.sets,
          reps: ex.reps,
          restTime: parseInt(ex.rest) || 60,
        })),
      };
      
      await addDoc(collection(db, "routines"), newRoutine);
      setIsSaved(true);
      fetchRoutines(); // Refresh list automatically
    } catch (err) {
      console.error("Error saving routine", err);
      setError("Error al guardar la rutina.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Mis Rutinas</h1>
        <p className="text-muted-foreground">Administra y genera tus entrenamientos.</p>
      </div>
      
      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="bg-sidebar">
          <TabsTrigger value="history">Historial de Rutinas</TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center gap-1"><Sparkles className="w-3 h-3"/> Generar con IA</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : routines.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Dumbbell className="w-5 h-5" /> Rutinas Guardadas</CardTitle>
                <CardDescription>No tienes rutinas guardadas. Ve a la pestaña "Generar con IA" para crear una.</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center border-t border-border mt-4">
                <p className="text-muted-foreground italic">Tu historial está vacío.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {routines.map((routine) => (
                <Card key={routine.id} className="hover:border-primary transition-colors cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{routine.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(routine.schedule.startDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground border-b border-border pb-1">Ejercicios:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {routine.exercises.slice(0, 4).map((ex, i) => (
                          <li key={i} className="flex justify-between">
                            <span className="truncate pr-2 capitalize">{ex.exerciseId.replace(/-/g, ' ')}</span>
                            <span>{ex.sets}x{ex.reps}</span>
                          </li>
                        ))}
                        {routine.exercises.length > 4 && (
                          <li className="text-xs italic text-center pt-1">+ {routine.exercises.length - 4} más</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="generate">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-secondary" />
                  Creador IA (Firebase AI Logic)
                </CardTitle>
                <CardDescription>Construye una rutina personalizada instantly.</CardDescription>
              </div>
              <button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
                {isGenerating ? "Generando..." : "Generar Rutina Mágica"}
              </button>
            </CardHeader>
            <CardContent className="border-t border-border mt-4 pt-4">
              {error && <p className="text-destructive text-sm mb-4">{error}</p>}
              
              {!routineAI && !isGenerating && !error && (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Presiona "Generar Rutina Mágica" para consultar a Gemini.
                </div>
              )}

              {isGenerating && (
                <div className="h-[200px] flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                  <p className="text-sm text-muted-foreground animate-pulse">Analizando tus objetivos...</p>
                </div>
              )}

              {routineAI && !isGenerating && (
                <div className="space-y-4">
                  {routineAI.map((ex, i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        setSelectedExercise(ex.name);
                        setIsModalOpen(true);
                      }}
                      className="p-4 rounded-lg bg-sidebar border border-border cursor-pointer hover:border-primary transition-colors group"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg text-primary group-hover:underline">{ex.name}</h3>
                        <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">Caché Dinámica</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                        <div><span className="text-muted-foreground block text-xs">Series/Reps</span> {ex.sets} x {ex.reps}</div>
                        <div><span className="text-muted-foreground block text-xs">Descanso</span> {ex.rest}</div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/50 italic">
                        Tip: {ex.tips}
                      </p>
                    </div>
                  ))}

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSaveRoutine}
                      disabled={isSaving || isSaved}
                      className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                      {isSaving ? "Guardando..." : isSaved ? "Guardado en Historial" : "Guardar Rutina"}
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <ExerciseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        exerciseName={selectedExercise} 
      />
    </div>
  );
}
