
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { LanguageSelection } from "@/components/language-selection";
import { translations } from "@/lib/translations";
import { ArrowLeft } from "lucide-react";
import type { Role } from "@/app/page";

export type Language = "en" | "hi" | "bn";

interface LoginProps {
  role: Role;
  onLogin: (language?: Language) => void;
  onBack: () => void;
}

export function Login({ role, onLogin, onBack }: LoginProps) {
  const [language, setLanguage] = useState<Language>("en");
  const t = translations[language];
  const Icon = role === "farmer" ? Icons.farmer : Icons.buyer;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(language);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
       <Button variant="ghost" size="icon" onClick={onBack} className="absolute top-4 left-4 h-10 w-10">
            <ArrowLeft className="h-6 w-6" />
        </Button>
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
            <Icon className="h-16 w-16 mb-4 text-primary" />
            <h1 className="text-3xl font-bold">{t.loginTitle}, {role === 'farmer' ? 'Farmer' : 'Buyer'}!</h1>
            <p className="text-muted-foreground">{t.loginDescription}</p>
        </div>

        {role === 'farmer' && (
            <Card>
                <CardHeader>
                    <CardTitle>{t.selectLanguage}</CardTitle>
                    <CardDescription>{t.choosePreferredLanguage}</CardDescription>
                </CardHeader>
                <CardContent>
                    <LanguageSelection onSelectLanguage={setLanguage} selectedLanguage={language} />
                </CardContent>
            </Card>
        )}
        
        <Card>
            <CardContent className="p-6">
                 <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">{t.emailLabel}</Label>
                        <Input id="email" type="email" placeholder={t.emailPlaceholder} defaultValue={role === 'farmer' ? 'farmer@khetgenie.com' : 'buyer@khetgenie.com'} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">{t.passwordLabel}</Label>
                        <Input id="password" type="password" defaultValue="password" required />
                    </div>
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                       {t.signInButton}
                    </Button>
                </form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
