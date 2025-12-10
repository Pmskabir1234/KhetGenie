"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type MapPlaceholderProps = {
  lat: number;
  lon: number;
  children?: React.ReactNode;
  className?: string;
};

export function MapPlaceholder({ lat, lon, children, className }: MapPlaceholderProps) {
  const mapImage = PlaceHolderImages.find((img) => img.id === "map-background");

  // Corrected simplified linear projection for placeholder
  const y = ((-lat + 90) / 180) * 100;
  const x = ((lon + 180) / 360) * 100;

  if (!mapImage) {
    return <div className={cn("w-full aspect-video bg-muted rounded-lg", className)}>Map image not found.</div>;
  }

  return (
    <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden shadow-md", className)}>
      <Image
        src={mapImage.imageUrl}
        alt={mapImage.description}
        fill
        sizes="50vw"
        style={{ objectFit: 'cover' }}
        data-ai-hint={mapImage.imageHint}
        priority
      />
      <div
        className="absolute transition-all duration-500"
        style={{ top: `${y}%`, left: `${x}%` }}
        title={`Location: ${lat}, ${lon}`}
      >
        <MapPin className="h-8 w-8 text-accent/80 fill-accent -translate-x-1/2 -translate-y-full" />
      </div>
      {children}
    </div>
  );
}
