"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Fetch user profile from Firestore to determine role
      const { doc, getDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase/config");
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.superAdmin) {
          router.push("/dashboard"); // Super Admin
        } else {
          // Get the first gym role
          const gymId = Object.keys(userData.roles || {})[0];
          const role = userData.roles[gymId];
          if (gymId && role) {
            router.push(`/${gymId}/${role}/dashboard`);
          } else {
            setError("No tienes roles asignados en ningún gimnasio.");
          }
        }
      } else {
        setError("Usuario no encontrado en la base de datos.");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="p-8 border border-border rounded-lg bg-card shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-primary mb-2">Gymrat</h1>
        <p className="text-muted-foreground text-center mb-8">Enter your credentials to continue</p>
        
        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-border rounded bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-border rounded bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground py-2 rounded font-medium hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
