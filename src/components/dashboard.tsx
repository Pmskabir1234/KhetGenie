"use client";

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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/app/page";

export function Dashboard({ role }: { role: Role }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
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
        <div className="flex items-center gap-2">
            <BadgeInfo className="h-5 w-5 text-muted-foreground" />
            <Badge variant="outline" className="text-lg capitalize py-1 px-3">
              {role}
            </Badge>
        </div>
      </div>
      <Tabs defaultValue="price-oracle" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="price-oracle" className="py-2">
            <DollarSign className="mr-2" />
            Price Oracle
          </TabsTrigger>
          <TabsTrigger value="quality-inspector" className="py-2">
            <Camera className="mr-2" />
            Quality Inspector
          </TabsTrigger>
          <TabsTrigger value="location-insights" className="py-2">
            <MapPin className="mr-2" />
            Location Insights
          </TabsTrigger>
          <TabsTrigger value="terms-summarizer" className="py-2">
            <MessagesSquare className="mr-2" />
            Terms Summarizer
          </TabsTrigger>
        </TabsList>
        <TabsContent value="price-oracle">
          <Card>
            <CardHeader>
              <CardTitle>AI Price Oracle</CardTitle>
              <CardDescription>
                Get AI-driven price recommendations for your crops based on
                market data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PriceOracle />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quality-inspector">
          <Card>
            <CardHeader>
              <CardTitle>AI Quality Inspector</CardTitle>
              <CardDescription>
                Analyze crop quality by uploading an image. Get a grade, issue
                report, and summary.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QualityInspector />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="location-insights">
          <Card>
            <CardHeader>
              <CardTitle>Location & Air Quality Insights</CardTitle>
              <CardDescription>
                Enter a city to get its coordinates and current air quality
                data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LocationInsights />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="terms-summarizer">
          <Card>
            <CardHeader>
              <CardTitle>AI Terms Summarizer</CardTitle>
              <CardDescription>
                Paste a negotiation conversation to get a summary of the terms
                and potential issues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TermsSummarizer />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
