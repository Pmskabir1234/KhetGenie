
"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/dummy-products";
import { Handshake, MapPin, Scale, User, IndianRupee, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ProductCard({ product }: { product: Product }) {
  const { toast } = useToast();

  const handleNegotiate = () => {
    toast({
      title: "Negotiation Started",
      description: `You have started a negotiation for ${product.name} with ${product.farmerName}.`,
    });
  };

  const marketPrice = product.pricePerKg * 1.15; // 15% higher market price
  const savings = marketPrice - product.pricePerKg;

  return (
    <Card className="overflow-hidden flex flex-col group transition-transform duration-200 ease-in-out hover:-translate-y-2">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full">
          <Image
            src={product.imageUrl}
            alt={`Image of ${product.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            data-ai-hint={product.imageHint}
          />
           <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-center text-white p-4">
              <TrendingDown className="h-8 w-8 mx-auto mb-2" />
              <p className="font-bold text-lg flex items-center justify-center">Save ~<IndianRupee className="h-5 w-5 mx-1" />{savings.toFixed(2)}/kg</p>
              <p className="text-xs">vs. market average</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl mb-2 text-primary">{product.name}</CardTitle>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{product.farmerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            <span>{product.quantityKg} kg available</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2 p-4 pt-0">
        <div className="flex items-baseline justify-center text-center p-3 rounded-lg bg-secondary/50 mb-2">
            <span className="text-2xl font-bold text-foreground flex items-center"><IndianRupee className="h-5 w-5 mr-1" />{product.pricePerKg.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">/kg</span>
        </div>
        <Button onClick={handleNegotiate} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Handshake className="mr-2 h-4 w-4" />
          Negotiate
        </Button>
      </CardFooter>
    </Card>
  );
}
