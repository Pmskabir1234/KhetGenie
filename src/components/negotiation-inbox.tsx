
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Language } from "@/components/login";
import { translations } from "@/lib/translations";
import { Bot, User } from "lucide-react";
import { useAuth, useCollection, useFirestore } from "@/firebase";
import { collection, query, where, orderBy, type Timestamp } from "firebase/firestore";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

interface Chat {
  id: string;
  participants: string[];
  listingName: string;
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: Timestamp;
  };
  unreadBy: string[];
}

export function NegotiationInbox({ lang }: { lang: Language }) {
  const t = translations[lang];
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, loading: userLoading } = useAuth();

  const chatsQuery = useMemo(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessage.timestamp', 'desc')
    );
  }, [firestore, user]);

  const { data: chats, loading: chatsLoading } = useCollection<Chat>(chatsQuery);

  if (userLoading || chatsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg border-2 border-dashed h-48">
        <Bot className="h-12 w-12 text-muted-foreground/50" />
        <p className="mt-4 text-sm text-muted-foreground">
          {t.noMessages}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chats.map((chat) => {
        const isUnread = chat.unreadBy.includes(user!.uid);
        const otherParticipantId = chat.participants.find(p => p !== user!.uid);

        return (
          <Card key={chat.id} className={`cursor-pointer hover:bg-secondary/50 ${isUnread ? "border-primary" : ""}`}>
            <CardContent className="p-4 flex items-start gap-4">
              <Avatar className="h-12 w-12 border">
                {/* In a real app, you would fetch the other user's profile to get their avatar */}
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>
              <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-center">
                  {/* In a real app, you would fetch the other user's profile to get their name */}
                  <h4 className="font-semibold truncate">User {otherParticipantId?.substring(0, 5)}</h4>
                  {chat.lastMessage?.timestamp && (
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(chat.lastMessage.timestamp.toDate(), { addSuffix: true })}
                    </p>
                  )}
                </div>
                <p className="text-sm font-medium text-primary">{chat.listingName}</p>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage?.text}</p>
              </div>
              {isUnread && <Badge className="bg-accent h-6 shrink-0">New</Badge>}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
