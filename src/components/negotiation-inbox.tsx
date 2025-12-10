
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Language } from "@/components/login";
import { translations } from "@/lib/translations";
import { Bot } from "lucide-react";

export function NegotiationInbox({ lang }: { lang: Language }) {
    const t = translations[lang];
    const messages = t.negotiationMessages;

    if(messages.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg border-2 border-dashed h-full">
                <Bot className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                {t.noMessages}
                </p>
            </div>
        )
    }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.id} className={`cursor-pointer hover:bg-secondary/50 ${message.unread ? "border-primary" : ""}`}>
          <CardContent className="p-4 flex items-start gap-4">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={message.avatar} alt={message.sender} />
              <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">{message.sender}</h4>
                <p className="text-xs text-muted-foreground">{message.timestamp}</p>
              </div>
              <p className="text-sm font-medium text-primary">{message.crop}</p>
              <p className="text-sm text-muted-foreground truncate">{message.lastMessage}</p>
            </div>
             {message.unread && <Badge className="bg-accent h-6">New</Badge>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
