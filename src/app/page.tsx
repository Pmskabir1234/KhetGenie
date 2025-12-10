"use client";

import { useState } from "react";
import { Dashboard } from "@/components/dashboard";
import { RoleSelection } from "@/components/role-selection";
import { Icons } from "@/components/icons";

export type Role = "farmer" | "buyer";

export default function Home() {
  const [role, setRole] = useState<Role | null>(null);

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

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Dashboard role={role} />
      </main>
    </div>
  );
}
