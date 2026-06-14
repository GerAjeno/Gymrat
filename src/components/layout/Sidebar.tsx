import Link from "next/link";
import { Dumbbell, Home, Users, Settings } from "lucide-react";

export function Sidebar({ gymId, role }: { gymId: string; role: string }) {
  let links = [];

  switch (role) {
    case "client":
      links = [
        { name: "Dashboard", href: `/${gymId}/client/dashboard`, icon: Home },
        { name: "Mis Rutinas", href: `/${gymId}/client/routines`, icon: Dumbbell },
        { name: "Calendario", href: `/${gymId}/client/calendar`, icon: Users }, // Placeholder icon
        { name: "Control de Peso", href: `/${gymId}/client/weight`, icon: Settings }, // Placeholder icon
      ];
      break;
    case "trainer":
      links = [
        { name: "Dashboard", href: `/${gymId}/trainer/dashboard`, icon: Home },
        { name: "Mis Clientes", href: `/${gymId}/trainer/clients`, icon: Users },
        { name: "Diseñar Rutina", href: `/${gymId}/trainer/builder`, icon: Dumbbell },
      ];
      break;
    case "admin":
      links = [
        { name: "Dashboard", href: `/${gymId}/admin/dashboard`, icon: Home },
        { name: "Entrenadores", href: `/${gymId}/admin/trainers`, icon: Users },
        { name: "Finanzas", href: `/${gymId}/admin/finances`, icon: Settings },
        { name: "Configuración", href: `/${gymId}/admin/settings`, icon: Settings },
      ];
      break;
    case "super_admin":
    default:
      links = [
        { name: "Dashboard", href: `/dashboard`, icon: Home },
        { name: "Gimnasios", href: `/gyms`, icon: Dumbbell },
        { name: "Facturación SaaS", href: `/billing`, icon: Settings },
      ];
      break;
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col h-screen">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <Dumbbell className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-wider text-sidebar-foreground uppercase">Gymrat</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center gap-3 px-4 py-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">{link.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground text-center">
        &copy; {new Date().getFullYear()} Gymrat SaaS
      </div>
    </aside>
  );
}
