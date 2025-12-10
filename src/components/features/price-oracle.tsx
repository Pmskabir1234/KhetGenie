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
import { getPriceRecommendation, PriceRecommendationOutput } from "@/ai/flows/price-recommendation-for-listing";
import { useToast } from "@/hooks/use-toast";
import { Bot } from "lucide-react";

const formSchema = z.object({
  crop_name: z.string().min(2, { message: "Crop name must be at least 2 characters." }),
  region: z.string().min(2, { message: "Region must be at least 2 characters." }),
  seasonality: z.string().optional(),
  quantity: z.coerce.number().positive({ message: "Quantity must be a positive number." }),
});

export function PriceOracle() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<PriceRecommendationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop_name: "",
      region: "",
      seasonality: "",
      quantity: 100,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await getPriceRecommendation(values);
      setRecommendation(result);
    } catch (error) {
      console.error("Error getting price recommendation:", error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Failed to get price recommendation. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="crop_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crop Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Wheat" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Punjab" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seasonality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seasonality (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Winter" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity (in KG)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Bot className="mr-2 h-4 w-4" />
            {isLoading ? "Getting Recommendation..." : "Get Price Recommendation"}
          </Button>
        </form>
      </Form>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center md:text-left">Recommendation</h3>
        {isLoading && (
          <Card className="bg-secondary/50">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>
        )}
        {recommendation && (
          <Card className="bg-secondary/50 border-primary/50 shadow-md">
            <CardHeader>
              <CardTitle className="text-primary text-center text-2xl">
                {recommendation.min_price?.toFixed(2) ?? 'N/A'} - {recommendation.max_price?.toFixed(2) ?? 'N/A'} <span className="text-sm font-medium text-muted-foreground"> per kg</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                <p className="text-lg font-semibold capitalize">{recommendation.confidence}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Justification</p>
                <p className="text-sm">{recommendation.justification}</p>
              </div>
            </CardContent>
          </Card>
        )}
         {!isLoading && !recommendation && (
            <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg border-2 border-dashed h-full">
                <Bot className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                AI recommendations will appear here.
                </p>
            </div>
         )}
      </div>
    </div>
  );
}
