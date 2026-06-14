"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase/config";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Plus, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WeightPage() {
  const { gymId } = useParams() as { gymId: string };
  const { user } = useAuth();
  
  const [weight, setWeight] = useState("");
  const [logs, setLogs] = useState<{ date: string, weight: number }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const logsRef = collection(db, "clients", user.uid, "weightLogs");
    const q = query(logsRef, orderBy("timestamp", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const docData = doc.data();
        const dateObj = docData.timestamp?.toDate() || new Date();
        return {
          id: doc.id,
          weight: docData.weight,
          date: dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
          rawDate: dateObj
        };
      });
      setLogs(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !user || isNaN(Number(weight))) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "clients", user.uid, "weightLogs"), {
        weight: Number(weight),
        timestamp: serverTimestamp()
      });
      setWeight("");
    } catch (err) {
      console.error("Error saving weight:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Control de Peso</h1>
        <p className="text-muted-foreground">Monitorea tu evolución corporal.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Añadir Registro</CardTitle>
            <CardDescription>Ingresa tu peso de hoy.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddWeight} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Peso (kg)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Ej. 75.5"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5" /> Evolución Gráfica</CardTitle>
            <CardDescription>
              Progreso histórico de tu composición.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 mt-4">
            {loading ? (
              <div className="h-full flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : logs.length < 2 ? (
              <div className="h-full flex flex-col items-center justify-center border-t border-border">
                <p className="text-muted-foreground text-sm">Añade al menos 2 registros para ver tu gráfico.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={logs}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1b1e', borderColor: '#333' }}
                    itemStyle={{ color: '#00D1FF' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#00D1FF" strokeWidth={2} dot={{ r: 4, fill: '#00D1FF' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
