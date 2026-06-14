<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/dumbbell.svg" alt="Gymrat Logo" width="80" height="80">
  
  # Gymrat SaaS 🚀
  
  **The ultimate Multi-Tenant Gym Management Platform powered by Google Gemini AI.**  
  *La plataforma definitiva Multi-Tenant para administración de gimnasios impulsada por IA.*

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-AI_Logic-FFCA28?style=flat&logo=firebase)](https://firebase.google.com/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
  [![Shadcn UI](https://img.shields.io/badge/UI-Shadcn-black?style=flat)](https://ui.shadcn.com/)

  [English](#english) • [Español](#español)
</div>

---

## English <a name="english"></a>

**Gymrat** is a modern, responsive, mobile-first SaaS designed to manage from a single gym to thousands. It provides dedicated interfaces for Super Admins, Gym Owners, Trainers, and Clients.

### ✨ Key Features
- 🏢 **Multi-Tenant Architecture:** Every gym gets its own isolated environment, branding, and color scheme.
- 🤖 **Gemini AI Integration:** Generates hyper-personalized workout routines on the fly using `firebase/ai` (Gemini 2.5 Flash Lite) directly from the client edge!
- 🗄️ **Smart Global Caching:** AI-generated exercises are stored globally in Firestore, reducing API latency and saving AI quota.
- 🛡️ **Role-Based Routing:** Next.js Route Groups perfectly separate authentication and navigation for `admin`, `trainer`, and `client`.
- 📊 **Interactive Tracking:** Clients can log their weights and see dynamic charts powered by Recharts.

### 🛠️ Tech Stack
- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS, Shadcn UI, Recharts.
- **Backend:** Firebase Authentication, Firestore (Native Mode), Firebase AI Logic.
- **Security:** Firebase App Check configured for edge-AI requests.

### 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/GerAjeno/Gymrat.git
   cd Gymrat
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Setup Firebase Config**
   Create a `.env.local` file in the root with your Firebase credentials.
4. **Run the development server**
   ```bash
   npm run dev
   ```

---

## Español <a name="español"></a>

**Gymrat** es un SaaS moderno, responsive y "mobile-first" diseñado para administrar desde un solo gimnasio hasta miles. Proporciona interfaces dedicadas para Súper Administradores, Dueños de Gimnasios, Entrenadores y Clientes.

### ✨ Características Principales
- 🏢 **Arquitectura Multi-Tenant:** Cada gimnasio obtiene su propio entorno aislado, marca y paleta de colores.
- 🤖 **Integración de IA Gemini:** ¡Genera rutinas de entrenamiento hiper-personalizadas al instante utilizando `firebase/ai` (Gemini 2.5 Flash Lite) directamente desde el frontend!
- 🗄️ **Caché Global Inteligente:** Los ejercicios generados por IA se almacenan globalmente en Firestore, lo que reduce el tiempo de espera de la API y ahorra cuota de uso.
- 🛡️ **Enrutamiento por Roles:** Los Grupos de Rutas de Next.js separan perfectamente la autenticación y la navegación para `admin`, `entrenador` y `cliente`.
- 📊 **Seguimiento Interactivo:** Los clientes pueden registrar sus pesos y ver gráficos dinámicos impulsados por Recharts.

### 🛠️ Tecnologías
- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS, Shadcn UI, Recharts.
- **Backend:** Firebase Authentication, Firestore (Modo Nativo), Firebase AI Logic.
- **Seguridad:** Firebase App Check configurado para proteger las peticiones de Inteligencia Artificial desde el navegador.

### 🚀 Empezando

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/GerAjeno/Gymrat.git
   cd Gymrat
   ```
2. **Instalar dependencias**
   ```bash
   npm install
   ```
3. **Configurar Firebase**
   Crea un archivo `.env.local` en la raíz con tus credenciales de Firebase.
4. **Ejecutar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

<div align="center">
  <br />
  <p><i>Developed with ❤️ for the fitness community.</i></p>
</div>
