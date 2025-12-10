
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
  ArrowLeft,
  List,
  Inbox,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/app/page";
import { BuyerDashboard } from "@/components/buyer-dashboard";
import { Language } from "@/components/login";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { FarmerListings } from "@/components/farmer-listings";
import { NegotiationInbox } from "@/components/negotiation-inbox";

export function Dashboard({ role, onBack, lang }: { role: Role, onBack: () => void, lang: Language }) {
  const t = translations[lang];

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
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-4 h-auto bg-transparent p-0">
            <TabsTrigger value="my-listings" className="p-0 h-full w-full">
              <Card className="hover:bg-primary/10 hover:border-primary data-[state=active]:bg-primary/10 data-[state=active]:border-primary transition-all w-full">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <List className="h-10 w-10 mb-2 text-primary" />
                  <h3 className="font-semibold">{t.myListings}</h3>
                  <p className="text-xs text-muted-foreground mt-1 whitespace-normal break-words">{t.myListingsShortDesc}</p>
                </CardContent>
              </Card>
            </TabsTrigger>
             <TabsTrigger value="negotiation-inbox" className="p-0 h-full w-full">
              <Card className="hover:bg-primary/10 hover:border-primary data-[state=active]:bg-primary/10 data-[state=active]:border-primary transition-all w-full">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Inbox className="h-10 w-10 mb-2 text-primary" />
                  <h3 className="font-semibold">{t.negotiationInbox}</h3>
                  <p className="text-xs text-muted-foreground mt-1 whitespace-normal break-words">{t.negotiationInboxShortDesc}</p>
                </CardContent>
              </Card>
            </TabsTrigger>
            <TabsTrigger value="price-oracle" className="p-0 h-full w-full">
              <Card className="hover:bg-primary/10 hover:border-primary data-[state=active]:bg-primary/10 data-[state=active]:border-primary transition-all w-full">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <DollarSign className="h-10 w-10 mb-2 text-primary" />
                  <h3 className="font-semibold">{t.priceOracle}</h3>
                  <p className="text-xs text-muted-foreground mt-1 whitespace-normal break-words">{t.priceOracleShortDesc}</p>
                </CardContent>
              </Card>
            </TabsTrigger>
            <TabsTrigger value="quality-inspector" className="p-0 h-full w-full">
               <Card className="hover:bg-primary/10 hover:border-primary data-[state=active]:bg-primary/10 data-[state=active]:border-primary transition-all w-full">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Camera className="h-10 w-10 mb-2 text-primary" />
                  <h3 className="font-semibold">{t.qualityInspector}</h3>
                  <p className="text-xs text-muted-foreground mt-1 whitespace-normal break-words">{t.qualityInspectorShortDesc}</p>
                </CardContent>
              </Card>
            </TabsTrigger>
            <TabsTrigger value="location-insights" className="p-0 h-full w-full">
               <Card className="hover:bg-primary/10 hover:border-primary data-[state=active]:bg-primary/10 data-[state=active]:border-primary transition-all w-full">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <MapPin className="h-10 w-10 mb-2 text-primary" />
                  <h3 className="font-semibold">{t.locationInsights}</h3>
                  <p className="text-xs text-muted-foreground mt-1 whitespace-normal break-words">{t.locationInsightsShortDesc}</p>
                </CardContent>
              </Card>
            </TabsTrigger>
            <TabsTrigger value="terms-summarizer" className="p-0 h-full w-full">
               <Card className="hover:bg-primary/10 hover:border-primary data-[state=active]:bg-primary/10 data-[state=active]:border-primary transition-all w-full">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <MessagesSquare className="h-10 w-10 mb-2 text-primary" />
                  <h3 className="font-semibold">{t.termsSummarizer}</h3>
                  <p className="text-xs text-muted-foreground mt-1 whitespace-normal break-words">{t.termsSummarizerShortDesc}</p>
                </CardContent>
              </Card>
            </TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="my-listings">
              <Card>
                <CardHeader>
                  <CardTitle>{t.myListings}</CardTitle>
                  <CardDescription>
                    {t.myListingsDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FarmerListings lang={lang} />
                </CardContent>
              </Card>
            </TabsContent>
             <TabsContent value="negotiation-inbox">
                <Card>
                    <CardHeader>
                    <CardTitle>{t.negotiationInbox}</CardTitle>
                    <CardDescription>
                        {t.negotiationInboxDescription}
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <NegotiationInbox lang={lang} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="price-oracle">
              <Card>
                <CardHeader>
                  <CardTitle>{t.aiPriceOracle}</CardTitle>
                  <CardDescription>
                    {t.priceOracleDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PriceOracle lang={lang} />
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
                  <QualityInspector lang={lang} />
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
                  <LocationInsights lang={lang} />
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
                  <TermsSummarizer lang={lang} />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        <BuyerDashboard lang={lang} />
      )}
    </div>
  );
}
