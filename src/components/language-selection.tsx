"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Language } from "@/components/dashboard";

interface LanguageSelectionProps {
  onSelectLanguage: (language: Language) => void;
}

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
];

export function LanguageSelection({ onSelectLanguage }: LanguageSelectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
      {languages.map((lang) => (
        <Card
          key={lang.code}
          className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-all transform hover:scale-105"
          onClick={() => onSelectLanguage(lang.code)}
        >
          <CardHeader className="items-center text-center">
            <CardTitle className="text-xl font-bold">{lang.name}</CardTitle>
            <p className="text-2xl text-primary font-semibold">{lang.nativeName}</p>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
