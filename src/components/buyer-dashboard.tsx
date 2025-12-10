
"use client";

import { dummyProducts } from "@/lib/dummy-products";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBasket, MessageSquare, IndianRupee, PiggyBank } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NegotiationInbox } from "@/components/negotiation-inbox";
import { Badge } from "@/components/ui/badge";

export function BuyerDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = dummyProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dummy stats
  const productsBought = 5;
  const negotiationsStarted = 12;
  const totalSpent = 15000;
  const totalSavings = 2500;


  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Bought</CardTitle>
              <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productsBought}</div>
              <p className="text-xs text-muted-foreground">in total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Negotiations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{negotiationsStarted}</div>
               <p className="text-xs text-muted-foreground">across all listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSpent.toLocaleString()}</div>
               <p className="text-xs text-muted-foreground">on all purchases</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{totalSavings.toLocaleString()}</div>
               <p className="text-xs text-muted-foreground">saved through negotiation</p>
            </CardContent>
          </Card>
      </div>

       <Tabs defaultValue="marketplace">
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="inbox" className="w-full justify-between">
            Negotiation Inbox
            <Badge className="ml-2">3</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="marketplace">
            <div className="flex justify-between items-center mb-4 mt-4">
              <h2 className="text-2xl font-bold tracking-tight">Available Crops</h2>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for crops..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center col-span-full py-16 text-muted-foreground">
                <p>No crops found matching your search.</p>
              </div>
            )}
        </TabsContent>
        <TabsContent value="inbox">
            <Card>
                <CardHeader>
                    <CardTitle>Negotiation Inbox</CardTitle>
                </CardHeader>
                <CardContent>
                    <NegotiationInbox lang="en" />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
