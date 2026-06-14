import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

// Objeto de configuración de Firebase cargado desde variables de entorno seguras
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Evita inicializar múltiples veces la aplicación en Next.js (Hot Reload)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Habilitar App Check con un Token de Depuración para desarrollo local
// Esto es requerido obligatoriamente para ejecutar modelos de Inteligencia Artificial desde el lado del cliente (Frontend)
if (typeof window !== "undefined") {
  // Configuración temporal que le dice a Firebase que imprima un token en la consola
  // @ts-ignore
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  initializeAppCheck(app, {
    // IMPORTANTE: Para producción, se debe cambiar esto por ReCaptchaEnterpriseProvider("TU_CLAVE_DE_SITIO_RECAPTCHA")
    provider: new ReCaptchaEnterpriseProvider("dummy_key_for_debug"),
    isTokenAutoRefreshEnabled: true // Permite la actualización automática del token de seguridad
  });
}

// Exportamos los servicios ya inicializados para usarlos en el resto del proyecto
export const auth = getAuth(app); // Autenticación de usuarios
export const db = getFirestore(app); // Base de datos NoSQL
export const storage = getStorage(app); // Almacenamiento de archivos (ej. imágenes de perfil, logos)
export const functions = getFunctions(app); // Funciones en la nube (Backend)
