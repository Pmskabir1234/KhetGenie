"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { GeocodingResponse, AirQualityResponse } from "@/lib/types";
import { MapPlaceholder } from "@/components/map-placeholder";
import { Bot, Search, Wind, Droplets, MapPin, Gauge } from "lucide-react";
import type { Language } from "@/components/dashboard";
import { translations } from "@/lib/translations";

const formSchema = z.object({
  city: z.string().min(2, { message: "City name must be at least 2 characters." }),
});

export function LocationInsights({ lang }: { lang: Language }) {
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [aqi, setAqi] = useState<AirQualityResponse | null>(null);
  const { toast } = useToast();
  const t = translations[lang];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
    },
  });

  const getOverallAqiStatus = (pm2_5: number | null): { status: string; advice: string; color: string } => {
    if (pm2_5 === null) return { status: 'Unknown', advice: 'Data unavailable.', color: 'gray' };
    if (pm2_5 <= 12) return { status: 'Good', advice: 'Air quality is satisfactory.', color: 'text-green-600' };
    if (pm2_5 <= 35.4) return { status: 'Moderate', advice: 'Some people may experience health effects.', color: 'text-yellow-500' };
    if (pm2_5 <= 55.4) return { status: 'Unhealthy for Sensitive Groups', advice: 'Sensitive groups may experience health effects.', color: 'text-orange-500' };
    return { status: 'Unhealthy', advice: 'Everyone may begin to experience health effects.', color: 'text-red-600' };
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setCoordinates(null);
    setAqi(null);
    try {
      // Geocoding
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(values.city)}&count=1`
      );
      if (!geoRes.ok) throw new Error("Failed to fetch geocoding data.");
      const geoData: GeocodingResponse = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        toast({ variant: "destructive", title: "City not found." });
        setIsLoading(false);
        return;
      }
      const { latitude, longitude } = geoData.results[0];
      setCoordinates({ lat: latitude, lon: longitude });

      // Air Quality
      const aqiRes = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5,carbon_monoxide,ozone,nitrogen_dioxide,sulphur_dioxide`
      );
      if (!aqiRes.ok) throw new Error("Failed to fetch air quality data.");
      const aqiData: AirQualityResponse = await aqiRes.json();
      setAqi(aqiData);
    } catch (error) {
      console.error("Error getting location insights:", error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Failed to fetch location data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const latestAqi = aqi?.hourly;
  const latestPm25 = latestAqi?.pm2_5[0];
  const aqiStatus = getOverallAqiStatus(latestPm25 ?? null);

  const aqiItems = [
    { icon: Wind, label: "PM2.5", value: latestAqi?.pm2_5[0]?.toFixed(2), unit: "µg/m³" },
    { icon: Wind, label: "PM10", value: latestAqi?.pm10[0]?.toFixed(2), unit: "µg/m³" },
    { icon: Gauge, label: "Ozone", value: latestAqi?.ozone[0]?.toFixed(2), unit: "µg/m³" },
    { icon: Droplets, label: "CO", value: latestAqi?.carbon_monoxide[0]?.toFixed(2), unit: "µg/m³" },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel className="sr-only">City</FormLabel>
                  <FormControl>
                    <Input placeholder={t.cityPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? t.searching : t.search}
            </Button>
          </form>
        </Form>
        {isLoading && (
            <div className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        )}
        {coordinates && (
          <MapPlaceholder lat={coordinates.lat} lon={coordinates.lon}>
            {aqi && (
              <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border">
                <h3 className={`font-bold text-lg ${aqiStatus.color}`}>{aqiStatus.status}</h3>
                <p className="text-sm text-muted-foreground">PM2.5: {latestPm25?.toFixed(2) ?? 'N/A'} µg/m³</p>
              </div>
            )}
          </MapPlaceholder>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center md:text-left">{t.results}</h3>
        {aqi && coordinates ? (
          <Card className="bg-secondary/50 border-primary/50 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <MapPin />
                {form.getValues("city")}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {t.lat}: {coordinates.lat.toFixed(4)}, {t.lon}: {coordinates.lon.toFixed(4)}
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-2">{t.airQualityReport}</h4>
              <div className="p-4 rounded-lg bg-background border mb-4">
                <p className={`text-xl font-bold ${aqiStatus.color}`}>{aqiStatus.status}</p>
                <p className="text-sm text-muted-foreground">{aqiStatus.advice}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {aqiItems.map(item => (
                  <div key={item.label} className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                    <item.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-semibold text-sm">{item.value ?? 'N/A'} <span className="text-xs font-normal">{item.unit}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : !isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg border-2 border-dashed h-full">
                <Bot className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                {t.locationSearchDisclaimer}
                </p>
            </div>
        )}
      </div>
    </div>
  );
}
