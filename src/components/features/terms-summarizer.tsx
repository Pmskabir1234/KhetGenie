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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { summarizeNegotiationTerms, SummarizeNegotiationTermsOutput } from "@/ai/flows/summarize-negotiation-terms";
import { Bot, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import type { Language } from "@/components/dashboard";
import { translations } from "@/lib/translations";

const formSchema = z.object({
  conversation: z.string().min(50, { message: "Conversation must be at least 50 characters." }),
});

export function TermsSummarizer({ lang }: { lang: Language }) {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummarizeNegotiationTermsOutput | null>(null);
  const { toast } = useToast();
  const t = translations[lang];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      conversation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeNegotiationTerms(values);
      setSummary(result);
    } catch (error) {
      console.error("Error summarizing terms:", error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Failed to summarize terms. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="conversation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.conversationText}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t.conversationPlaceholder}
                    className="min-h-[250px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Bot className="mr-2 h-4 w-4" />
            {isLoading ? t.summarizing : t.summarizeTerms}
          </Button>
        </form>
      </Form>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center md:text-left">{t.summaryTitle}</h3>
        {isLoading && (
          <Card className="bg-secondary/50">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        )}
        {summary && (
          <Card className="bg-secondary/50 border-primary/50 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {summary.agreementReached ? <CheckCircle className="text-green-600" /> : <AlertTriangle className="text-yellow-500" />}
                {t.agreementStatus}
              </CardTitle>
              <CardDescription>
                <Badge variant={summary.agreementReached ? "default" : "destructive"} className={summary.agreementReached ? 'bg-green-600' : 'bg-yellow-500 text-white'}>
                  {summary.agreementReached ? t.agreementReached : t.noAgreement}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-background p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">{t.pricePerKgLabel}</p>
                  <p className="text-lg font-bold text-primary">{summary.pricePerKg?.toLocaleString() ?? 'N/A'}</p>
                </div>
                <div className="bg-background p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">{t.quantityLabel}</p>
                  <p className="text-lg font-bold text-primary">{summary.quantity?.toLocaleString() ?? 'N/A'} kg</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold flex items-center gap-2"><FileText /> {t.notesAndConditions}</h4>
                <p className="text-sm text-muted-foreground mt-1">{summary.notes || t.noNotes}</p>
              </div>

              {summary.warnings.length > 0 && (
                <div>
                  <h4 className="font-semibold flex items-center gap-2 text-destructive"><AlertTriangle /> {t.potentialIssues}</h4>
                   <ul className="list-disc list-inside mt-1 space-y-1 text-sm text-destructive/90">
                    {summary.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {!isLoading && !summary && (
            <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg border-2 border-dashed h-full">
                <Bot className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                {t.summarizerDisclaimer}
                </p>
            </div>
        )}
      </div>
    </div>
  );
}
