
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { dummyProducts, type Product } from "@/lib/dummy-products";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import type { Language } from "@/components/login";
import { translations } from "@/lib/translations";
import { AddListingDialog } from "@/components/add-listing-dialog";

export function FarmerListings({ lang }: { lang: Language }) {
    const t = translations[lang];
    const [listings, setListings] = useState<Product[]>(dummyProducts);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddListing = (newListing: Omit<Product, 'id' | 'farmerName' | 'location' | 'imageHint'>) => {
        const product: Product = {
            id: listings.length + 1,
            farmerName: 'Current Farmer', // Replace with actual farmer data
            location: 'Their Location', // Replace with actual farmer data
            imageHint: newListing.name,
            ...newListing,
        };
        setListings([product, ...listings]);
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t.myListings}</CardTitle>
                        <CardDescription>You have {listings.length} active listings.</CardDescription>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t.addNewListing}
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Crop</TableHead>
                                <TableHead>Price (per kg)</TableHead>
                                <TableHead>Quantity (kg)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listings.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>₹{product.pricePerKg.toFixed(2)}</TableCell>
                                    <TableCell>{product.quantityKg}</TableCell>
                                    <TableCell>
                                        <Badge>Active</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <AddListingDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onAddListing={handleAddListing}
                lang={lang}
            />
        </>
    )
}
