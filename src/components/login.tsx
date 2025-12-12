
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { LanguageSelection } from "@/components/language-selection";
import { translations } from "@/lib/translations";
import { ArrowLeft, UserPlus } from "lucide-react";
import type { Role } from "@/app/page";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


export type Language = "en" | "hi" | "bn";

interface LoginProps {
  role: Role;
  onLogin: (language?: Language) => void;
  onBack: () => void;
}

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});


export function Login({ role, onLogin, onBack }: LoginProps) {
  const [language, setLanguage] = useState<Language>("en");
  const t = translations[language];
  const Icon = role === "farmer" ? Icons.farmer : Icons.buyer;
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: role === 'farmer' ? 'farmer@khetgenie.com' : 'buyer@khetgenie.com',
      password: "password",
    },
  });

  const handleSignIn = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: "Signed in successfully!" });
      onLogin(language);
    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: "Sign in failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      // Add user to Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: role,
        displayName: user.email?.split('@')[0] ?? 'New User',
        photoURL: '',
      });

      toast({ title: "Account created successfully!" });
      onLogin(language);
    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: "Sign up failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
       <Button variant="ghost" size="icon" onClick={onBack} className="absolute top-4 left-4 h-10 w-10">
            <ArrowLeft className="h-6 w-6" />
        </Button>
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
            <Icon className="h-16 w-16 mb-4 text-primary" />
            <h1 className="text-3xl font-bold">{t.loginTitle}, {role === 'farmer' ? 'Farmer' : 'Buyer'}!</h1>
            <p className="text-muted-foreground">{t.loginDescription}</p>
        </div>

        {role === 'farmer' && (
            <Card>
                <CardHeader>
                    <CardTitle>{t.selectLanguage}</CardTitle>
                    <CardDescription>{t.choosePreferredLanguage}</CardDescription>
                </CardHeader>
                <CardContent>
                    <LanguageSelection onSelectLanguage={setLanguage} selectedLanguage={language} />
                </CardContent>
            </Card>
        )}
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.emailLabel}</FormLabel>
                          <FormControl>
                            <Input placeholder={t.emailPlaceholder} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.passwordLabel}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                       {isLoading ? 'Signing In...' : t.signInButton}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
                     <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.emailLabel}</FormLabel>
                          <FormControl>
                            <Input placeholder={t.emailPlaceholder} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.passwordLabel}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      <UserPlus className="mr-2 h-4 w-4" />
                       {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
