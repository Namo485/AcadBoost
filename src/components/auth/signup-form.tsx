"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { getStorage } from "firebase/storage";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";


const formSchema = z.object({
  name: z.string().min(1, { message: "Please enter your name." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  repeatPassword: z.string(),
  profilePhoto: z.instanceof(File).optional(),
}).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords don't match",
  path: ["repeatPassword"],
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,35.836,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const storage = getStorage();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!auth || !firestore) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: "Firebase is not initialized. Please try again later.",
      });
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      let photoURL = "";
      if (values.profilePhoto) {
        const storageRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(storageRef, values.profilePhoto);
        photoURL = await getDownloadURL(storageRef);
      }
      
      await updateProfile(user, {
        displayName: values.name,
        photoURL: photoURL || undefined,
      });

      await setDoc(doc(firestore, "users", user.uid), {
        id: user.uid,
        name: values.name,
        email: values.email,
        profilePhotoUrl: photoURL,
      });

      await sendEmailVerification(user);

      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox to verify your email.",
      });

      // Redirect to a dedicated verification page
      router.push(`/verify-email?email=${values.email}`);

    } catch (error: any) {
      let description = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        description = "User already exists. Sign in?";
      } else {
        console.error("Sign up failed:", error);
      }
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description,
      });
    }
  }
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('profilePhoto', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
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

      // Create a user profile document if it doesn't exist
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          profilePhotoUrl: user.photoURL,
        }, { merge: true });
      }

      toast({
        title: "Sign Up Successful",
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
        title: "Sign Up Failed",
        description: error.message || "An error occurred during Google Sign-Up.",
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
              name="profilePhoto"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel htmlFor="photo-upload">
                    <Avatar className="w-24 h-24 cursor-pointer">
                      <AvatarImage src={photoPreview ?? undefined} />
                      <AvatarFallback>
                        <User className="w-10 h-10" />
                      </AvatarFallback>
                    </Avatar>
                  </FormLabel>
                  <FormControl>
                    <Input id="photo-upload" type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                  </FormControl>
                  <FormDescription>Click avatar to upload a profile photo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="pl-10"/>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="repeatPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repeat Password</FormLabel>
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
              {form.formState.isSubmitting ? 'Creating Account...' : 'Sign Up'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="relative w-full">
              <Separator className="shrink-0" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>
             <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} type="button">
                <GoogleIcon className="mr-2 h-5 w-5" />
                Sign up with Google
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
