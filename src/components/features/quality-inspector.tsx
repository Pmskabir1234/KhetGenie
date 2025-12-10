"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { analyzeCropQualityFromImage, AnalyzeCropQualityFromImageOutput } from "@/ai/flows/analyze-crop-quality-from-image";
import { Bot, Upload, AlertTriangle } from "lucide-react";

const formSchema = z.object({
  photoDataUri: z.string().min(1, "Image is required"),
});

export function QualityInspector() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeCropQualityFromImageOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          {preview ? "Change Image" : "Upload Crop Image"}
        </Button>

        {preview && (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
            <Image src={preview} alt="Crop preview" fill style={{ objectFit: 'cover' }} />
          </div>
        )}

        <Button onClick={handleSubmit} disabled={isLoading || !preview} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Bot className="mr-2 h-4 w-4" />
          {isLoading ? "Analyzing..." : "Analyze Quality"}
        </Button>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center md:text-left">Analysis Report</h3>
        {isLoading && (
          <Card className="bg-secondary/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-center">
                <Skeleton className="h-16 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-1/2 mx-auto" />
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
            <CardHeader className="items-center">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 border-2 border-primary">
                <span className="text-4xl font-bold text-primary">{analysis.quality_grade}</span>
              </div>
              <CardTitle className="text-primary text-2xl pt-2">Grade {analysis.quality_grade}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold flex items-center gap-2"><AlertTriangle className="text-destructive"/> Visible Issues</h4>
                {analysis.visible_issues.length > 0 ? (
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {analysis.visible_issues.map((issue, index) => (
                      <li key={index} className="text-sm">{issue}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">No major issues detected.</p>
                )}
              </div>
              <div>
                <h4 className="font-semibold">Summary</h4>
                <p className="text-sm text-muted-foreground mt-1">{analysis.summary}</p>
              </div>
            </CardContent>
          </Card>
        )}
        {!isLoading && !analysis && (
            <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg border-2 border-dashed h-full">
                <Bot className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                Upload an image and the AI analysis will appear here.
                </p>
            </div>
        )}
      </div>
    </div>
  );
}
