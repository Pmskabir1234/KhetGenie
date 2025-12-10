"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { analyzeCropQualityFromImage, AnalyzeCropQualityFromImageOutput } from "@/ai/flows/analyze-crop-quality-from-image";
import { Bot, Upload, AlertTriangle, CheckCircle, Sparkles, Image as ImageIcon, X } from "lucide-react";
import type { Language } from "@/components/dashboard";
import { translations } from "@/lib/translations";

export function QualityInspector({ lang }: { lang: Language }) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeCropQualityFromImageOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearPreview = useCallback(() => {
    setPreview(null);
    setAnalysis(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleSubmit = async () => {
    if (!preview) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image file to analyze.",
      });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const result = await analyzeCropQualityFromImage({ photoDataUri: preview });
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing crop quality:", error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Failed to analyze crop quality. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {preview ? (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border-2 border-dashed group">
             <Image src={preview} alt="Crop preview" fill style={{ objectFit: 'cover' }} />
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="destructive" size="icon" onClick={handleClearPreview}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Remove Image</span>
                </Button>
             </div>
          </div>
        ) : (
          <div 
            className="aspect-video w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground font-semibold">{t.uploadCropImage}</p>
            <p className="text-xs text-muted-foreground/80">Click here to select a file</p>
          </div>
        )}

        <Button onClick={handleSubmit} disabled={isLoading || !preview} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-6">
          <Sparkles className="mr-2 h-5 w-5" />
          {isLoading ? t.analyzing : t.analyzeQuality}
        </Button>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center md:text-left">{t.analysisReport}</h3>
        {isLoading && (
          <Card className="bg-secondary/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-center">
                <Skeleton className="h-20 w-20 rounded-full" />
              </div>
              <Skeleton className="h-6 w-1/2 mx-auto" />
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
               <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>
        )}
        {analysis && (
          <Card className="bg-secondary/50 border-primary/50 shadow-md">
            <CardHeader className="items-center text-center pb-4">
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 border-4 border-primary animate-pulse-slow">
                <span className="text-5xl font-bold text-primary">{analysis.quality_grade}</span>
              </div>
              <CardTitle className="text-primary text-3xl pt-2">{t.grade} {analysis.quality_grade}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold flex items-center gap-2 text-lg mb-2">
                  {analysis.visible_issues.length > 0 ? <AlertTriangle className="text-destructive"/> : <CheckCircle className="text-green-600"/>} 
                  {t.visibleIssues}
                </h4>
                {analysis.visible_issues.length > 0 ? (
                  <ul className="list-disc list-inside mt-1 space-y-1 text-destructive/90">
                    {analysis.visible_issues.map((issue, index) => (
                      <li key={index} className="text-sm">{issue}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{t.noIssues}</p>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">{t.summary}</h4>
                <p className="text-sm text-muted-foreground mt-1 bg-background/50 p-3 rounded-md border">{analysis.summary}</p>
              </div>
            </CardContent>
          </Card>
        )}
        {!isLoading && !analysis && (
            <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg border-2 border-dashed h-full">
                <Bot className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                {t.uploadAndAnalyzeDisclaimer}
                </p>
            </div>
        )}
      </div>
    </div>
  );
}
