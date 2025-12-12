
"use client";

import { useState, useCallback } from "react";
import { Dashboard } from "@/components/dashboard";
import { RoleSelection } from "@/components/role-selection";
import { Icons } from "@/components/icons";
import { Login, Language } from "@/components/login";
import { useUser } from "@/firebase/auth/use-user";
import { Skeleton } from "@/components/ui/skeleton";

export type Role = "farmer" | "buyer";

export default function Home() {
  const [role, setRole] = useState<Role | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const { user, loading } = useUser();

  const handleBackToRoleSelection = useCallback(() => {
    setRole(null);
  }, []);

  const handleLogin = (lang?: Language) => {
    if (lang) {
      setLanguage(lang);
    }
  };

  if (loading) {
    return (
       <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
          <div className="flex items-center gap-4 mb-8">
            <Icons.logo className="h-12 w-12" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline text-primary">
                Welcome to KhetGenie
              </h1>
              <p className="text-muted-foreground">
                Your AI assistant for the agricultural marketplace.
              </p>
            </div>
          </div>
          <div className="w-full max-w-md space-y-4">
             <Skeleton className="h-32 w-full" />
             <Skeleton className="h-48 w-full" />
          </div>
      </div>
    )
  }

  if (!role) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <div className="flex items-center gap-4 mb-8">
          <Icons.logo className="h-12 w-12" />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline text-primary">
              Welcome to KhetGenie
            </h1>
            <p className="text-muted-foreground">
              Your AI assistant for the agricultural marketplace.
            </p>
          </div>
        </div>
        <RoleSelection onSelectRole={setRole} />
      </div>
    );
  }

  if (!user) {
    return <Login role={role} onLogin={handleLogin} onBack={handleBackToRoleSelection} />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Dashboard role={role} onBack={handleBackToRoleSelection} lang={language} />
      </main>
    </div>
  );
}
