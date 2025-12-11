
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Language } from "@/components/login";
import { translations } from "@/lib/translations";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Crop name is required." }),
  pricePerKg: z.coerce.number().positive({ message: "Price must be positive." }),
  quantityKg: z.coerce.number().positive({ message: "Quantity must be positive." }),
  imageUrl: z.string().url({ message: "A valid image is required." }),
});

interface AddListingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (newListing: z.infer<typeof formSchema>) => void;
  lang: Language;
}

export function AddListingDialog({ isOpen, onClose, onAddListing, lang }: AddListingDialogProps) {
  const t = translations[lang];
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      pricePerKg: 0,
      quantityKg: 0,
      imageUrl: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        form.setValue("imageUrl", result);
        form.clearErrors("imageUrl");
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearPreview = () => {
    setPreview(null);
    form.setValue("imageUrl", "");
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onAddListing(values);
    toast({
        title: "Listing Added!",
        description: `${values.name} has been successfully listed.`,
    })
    form.reset();
    clearPreview();
    onClose();
  };
  
  const handleClose = () => {
    form.reset();
    clearPreview();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.addNewListing}</DialogTitle>
          <DialogDescription>
            Enter the details of your crop to list it on the marketplace.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.cropName}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.cropNamePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pricePerKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (per kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantityKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                   <FormLabel>Crop Image</FormLabel>
                   <FormControl>
                       <>
                         <Input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef} 
                            onChange={handleFileChange}
                            className="hidden"
                         />
                         {preview ? (
                             <div className="relative aspect-video w-full rounded-md border group">
                                 <Image src={preview} alt="Crop preview" fill className="object-cover rounded-md" />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="destructive" size="icon" type="button" onClick={clearPreview}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                 </div>
                             </div>
                         ) : (
                            <div 
                                className="aspect-video w-full rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">Upload Image</p>
                            </div>
                         )}
                       </>
                   </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Add Listing</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
