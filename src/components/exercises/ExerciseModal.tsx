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
    if (!exerciseName || !isOpen) return;

    const fetchOrGenerateDetails = async () => {
      setLoading(true);
      setDetails(null);
      
      const safeId = exerciseName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const docRef = doc(db, "exercises", safeId);
      
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // Use cached data
          setDetails(docSnap.data() as ExerciseDetail);
        } else {
          // Generate with AI and save to Firestore
          const prompt = `Proporciona las instrucciones y los músculos involucrados para el ejercicio: "${exerciseName}".`;
          const result = await exerciseDetailModel.generateContent(prompt);
          const aiData = JSON.parse(await result.response.text());
          
          const newExercise: ExerciseDetail = {
            id: safeId,
            name: exerciseName,
            description: aiData.description,
            muscles: aiData.muscles,
            // Placeholder since user doesn't have Blaze plan for Gemini Image Generation
            imageUrl: "" 
          };
          
          await setDoc(docRef, newExercise);
          setDetails(newExercise);
        }
      } catch (e) {
        console.error("Error fetching exercise details:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrGenerateDetails();
  }, [exerciseName, isOpen]);

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
