"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { auth } from "@/lib/firebase/config";

export function TopNav() {
  const { user } = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1">{/* Search or Breadcrumbs can go here */}</div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground hidden sm:block">
              {user.email}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        ) : (
          <Button variant="default">
            <User className="w-4 h-4 mr-2" /> Login
          </Button>
        )}
      </div>
    </header>
  );
}
