"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/icons";
import { PriceOracle } from "@/components/features/price-oracle";
import { QualityInspector } from "@/components/features/quality-inspector";
import { LocationInsights } from "@/components/features/location-insights";
import { TermsSummarizer } from "@/components/features/terms-summarizer";
import {
  Camera,
  DollarSign,
  MapPin,
  MessagesSquare,
  BadgeInfo,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/app/page";
import { BuyerDashboard } from "@/components/buyer-dashboard";
import { LanguageSelection } from "@/components/language-selection";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";

export type Language = "en" | "hi" | "bn";

export function Dashboard({ role, onBack }: { role: Role, onBack: () => void }) {
  const [language, setLanguage] = useState<Language>("en");
  const [showLangSelection, setShowLangSelection] = useState(role === "farmer");

  if (role === "farmer" && showLangSelection) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Globe className="h-10 w-10 text-primary" />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Select Language</h2>
            <p className="text-muted-foreground">Please choose your preferred language.</p>
          </div>
        </div>
        <LanguageSelection
          onSelectLanguage={(lang) => {
            setLanguage(lang);
            setShowLangSelection(false);
          }}
        />
      </div>
    );
  }
  
  const t = translations[language];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-4">
            <Icons.logo className="h-10 w-10" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline text-primary">
                KhetGenie
              </h1>
              <p className="text-muted-foreground">
                Your AI assistant for the agricultural marketplace.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <BadgeInfo className="h-5 w-5 text-muted-foreground" />
            <Badge variant="outline" className="text-lg capitalize py-1 px-3">
              {role}
            </Badge>
        </div>
      </div>
      {role === "farmer" ? (
        <Tabs defaultValue="price-oracle" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="price-oracle" className="py-2">
              <DollarSign className="mr-2" />
              {t.priceOracle}
            </TabsTrigger>
            <TabsTrigger value="quality-inspector" className="py-2">
              <Camera className="mr-2" />
              {t.qualityInspector}
            </TabsTrigger>
            <TabsTrigger value="location-insights" className="py-2">
              <MapPin className="mr-2" />
              {t.locationInsights}
            </TabsTrigger>
            <TabsTrigger value="terms-summarizer" className="py-2">
              <MessagesSquare className="mr-2" />
              {t.termsSummarizer}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="price-oracle">
            <Card>
              <CardHeader>
                <CardTitle>{t.aiPriceOracle}</CardTitle>
                <CardDescription>
                  {t.priceOracleDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PriceOracle lang={language} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="quality-inspector">
            <Card>
              <CardHeader>
                <CardTitle>{t.aiQualityInspector}</CardTitle>
                <CardDescription>
                  {t.qualityInspectorDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QualityInspector lang={language} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="location-insights">
            <Card>
              <CardHeader>
                <CardTitle>{t.locationInsightsTitle}</CardTitle>
                <CardDescription>
                  {t.locationInsightsDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LocationInsights lang={language} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="terms-summarizer">
            <Card>
              <CardHeader>
                <CardTitle>{t.aiTermsSummarizer}</CardTitle>
                <CardDescription>
                  {t.termsSummarizerDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TermsSummarizer lang={language} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <BuyerDashboard />
      )}
    </div>
  );
}
