"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

// Definimos la estructura del Contexto de Autenticación
interface AuthContextType {
  user: FirebaseUser | null; // Objeto de usuario de Firebase, nulo si no ha iniciado sesión
  loading: boolean; // Estado de carga mientras Firebase verifica el estado de la sesión
}

// Creamos el contexto con valores iniciales por defecto
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

// Componente Proveedor que envuelve la aplicación para inyectar la sesión
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Escuchamos los cambios en el estado de autenticación (Login/Logout)
  useEffect(() => {
    // onAuthStateChanged se dispara automáticamente cuando el usuario entra o sale de su cuenta
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Actualizamos el estado con el usuario (o null)
      setLoading(false); // Detenemos el indicador de carga una vez verificada la sesión
    });
    
    // Función de limpieza para desmontar el listener cuando el componente se destruye
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

// Hook personalizado para acceder fácilmente a la sesión del usuario desde cualquier componente
export const useAuth = () => useContext(AuthContext);
