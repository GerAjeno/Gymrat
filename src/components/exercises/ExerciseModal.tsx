"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Dumbbell } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { exerciseDetailModel } from "@/lib/firebase/ai";

interface ExerciseDetail {
  id: string;
  name: string;
  description: string;
  muscles: string[];
  imageUrl?: string;
}

export function ExerciseModal({ 
  isOpen, 
  onClose, 
  exerciseName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  exerciseName: string | null;
}) {
  const [details, setDetails] = useState<ExerciseDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !exerciseName) return;

    const fetchExercise = async () => {
      setLoading(true);
      
      // Formatear el nombre para que funcione como un ID de documento único
      // ej: "Press de Banca Inclinado" -> "press-de-banca-inclinado"
      const docId = exerciseName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const docRef = doc(db, "exercises", docId);
      
      try {
        // PASO 1: CACHÉ GLOBAL
        // Intentar leer de Firestore para ahorrar llamadas a la IA y acelerar la carga
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          // Si el ejercicio ya está en la base de datos, lo mostramos inmediatamente (Ahorro de API!)
          setDetails(docSnap.data() as ExerciseDetail);
        } else {
          // PASO 2: GENERACIÓN CON IA (GEMINI)
          // Si es un ejercicio nuevo, se lo pedimos a Gemini Flash Lite
          const prompt = `Proporciona las instrucciones y los músculos involucrados para el ejercicio: "${exerciseName}".`;
          const result = await exerciseDetailModel.generateContent(prompt);
          const aiData = JSON.parse(await result.response.text());
          
          const newExercise: ExerciseDetail = {
            id: docId,
            name: exerciseName,
            description: aiData.description,
            muscles: aiData.muscles,
            imageUrl: "" 
          };
          
          // PASO 3: GUARDAR EN LA BASE DE DATOS
          // Guardamos el resultado en Firestore para que el próximo usuario que pida
          // este ejercicio lo obtenga de la caché instantáneamente sin usar IA.
          await setDoc(docRef, newExercise);
          setDetails(newExercise);
        }
      } catch (err) {
        console.error("Error fetching/generating exercise:", err);
      } finally {
        setLoading(false); // Detenemos el spinner de carga
      }
    };

    fetchExercise();
  }, [isOpen, exerciseName]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-primary" />
            {exerciseName}
          </DialogTitle>
          <DialogDescription>
            Detalles técnicos y ejecución.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 min-h-[200px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm">Consultando base de datos y IA...</p>
            </div>
          ) : details ? (
            <div className="space-y-4">
              <div className="w-full h-40 bg-muted rounded-md flex items-center justify-center border border-border">
                {/* Image Placeholder */}
                <div className="text-center">
                  <Dumbbell className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-xs text-muted-foreground">Imagen IA (Requiere Plan Blaze)</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1 text-primary">Músculos Involucrados</h4>
                <div className="flex flex-wrap gap-2">
                  {details.muscles.map((m, i) => (
                    <span key={i} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1 text-primary">Ejecución</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {details.description}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-destructive">No se pudo cargar la información.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
