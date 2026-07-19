"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import { signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useState } from 'react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,35.836,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handlePasswordReset = async () => {
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Firebase is not initialized.",
      });
      return;
    }
    if (!resetEmail) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address.",
      });
      return;
    }

    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for a link to reset your password.",
      });
      setDialogOpen(false);
      setResetEmail("");
    } catch (error: any) {
      console.error("Password reset failed:", error);
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: "Could not send reset email. Please check the address and try again.",
      });
    } finally {
      setIsResetting(false);
    }
  };


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!auth) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Firebase is not initialized. Please try again later.",
        });
        return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      if (!userCredential.user.emailVerified) {
        await sendEmailVerification(userCredential.user);
        toast({
          variant: "destructive",
          title: "Email Not Verified",
          description: "Please verify your email before logging in. A new verification email has been sent.",
        });
        router.push(`/verify-email?email=${values.email}`);
        return;
      }

      toast({
        title: "Login Successful",
        description: "Redirecting to your dashboard...",
      });
      router.push('/dashboard');
    } catch (error: any) {
      let description = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        description = "Password or Email Incorrect";
      } else {
        console.error("Login failed:", error);
      }
      toast({
        variant: "destructive",
        title: "Login Failed",
        description,
      });
    }
  }

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: "Firebase is not initialized.",
      });
      return;
    }

    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      // Create a user profile document if it doesn't exist (first-time Google login)
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          profilePhotoUrl: user.photoURL,
        }, { merge: true });
      }

      toast({
        title: "Login Successful",
        description: "Redirecting to your dashboard...",
      });
      router.push('/dashboard');

    } catch (error: any) {
      // Don't show a toast for this specific error
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }
      console.error("Google sign in failed:", error);
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message || "An error occurred during Google Sign-In.",
      });
    }
  };


  return (
    <Card className="shadow-2xl shadow-primary/10 bg-card/80 backdrop-blur-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="pt-6 space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} className="pl-10"/>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                   <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
             <Button type="submit" className="w-full font-bold" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="link" size="sm" className="p-0 h-auto text-muted-foreground">
                    Forgot Password?
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                  <DialogDescription>
                    Enter your email address below and we'll send you a link to reset your password.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="reset-email" className="text-right">
                      Email
                    </FormLabel>
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="col-span-3"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handlePasswordReset} disabled={isResetting}>
                    {isResetting ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="relative w-full">
              <Separator className="shrink-0" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} type="button">
                <GoogleIcon className="mr-2 h-5 w-5" />
                Sign in with Google
            </Button>

          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

// hiii 
