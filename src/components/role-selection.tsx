"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Tractor } from "lucide-react";
import type { Role } from "@/app/page";

interface RoleSelectionProps {
  onSelectRole: (role: Role) => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 w-full max-w-2xl">
      <Card
        className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-all transform hover:scale-105"
        onClick={() => onSelectRole("farmer")}
      >
        <CardHeader className="items-center text-center">
          <Tractor className="h-16 w-16 mb-4 text-primary" />
          <CardTitle className="text-2xl">I am a Farmer</CardTitle>
          <CardDescription>
            I want to list my crops, get price suggestions, and connect with buyers.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card
        className="cursor-pointer hover:bg-accent/10 hover:border-accent transition-all transform hover:scale-105"
        onClick={() => onSelectRole("buyer")}
      >
        <CardHeader className="items-center text-center">
          <User className="h-16 w-16 mb-4 text-accent" />
          <CardTitle className="text-2xl">I am a Buyer</CardTitle>
          <CardDescription>
            I want to browse available crops, view prices, and negotiate with farmers.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
