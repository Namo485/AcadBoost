'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth, useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as LucideUser } from 'lucide-react';
import { updateEmail, updateProfile } from 'firebase/auth';
import { cn } from '@/lib/utils';
import type { User as UserEntity } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Please enter a valid email.'),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  profilePhoto: z.instanceof(File).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileSettingsPage() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const storage = getStorage();
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserEntity>(userDocRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phoneNumber: userProfile.phoneNumber || '',
        address: userProfile.address || '',
      });
      setPhotoPreview(userProfile.profilePhotoUrl || user?.photoURL || null);
    } else if (user) {
      // Fallback to auth user data if Firestore profile doesn't exist yet
      form.reset({
        name: user.displayName || '',
        email: user.email || '',
      });
      setPhotoPreview(user.photoURL);
    }
  }, [user, userProfile, form]);
  
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

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !auth?.currentUser || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to update your profile.',
      });
      return;
    }

    try {
      let photoURL = userProfile?.profilePhotoUrl || user.photoURL;

      // Upload new photo if provided
      if (data.profilePhoto) {
        const storageRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(storageRef, data.profilePhoto);
        photoURL = await getDownloadURL(storageRef);
      }
      
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: photoURL ?? undefined,
      });

      // Update email in Firebase Auth
      if (data.email !== user.email) {
        await updateEmail(auth.currentUser, data.email);
      }

      // Update user document in Firestore
      await setDoc(
        doc(firestore, 'users', user.uid),
        {
          id: user.uid,
          name: data.name,
          email: data.email,
          profilePhotoUrl: photoURL,
          phoneNumber: data.phoneNumber,
          address: data.address,
        },
        { merge: true }
      );
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'An error occurred while updating your profile.',
      });
    }
  };

  if (isProfileLoading) {
      return (
          <Card>
              <CardHeader>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-8">
                  <div className="flex items-center gap-4">
                      <Skeleton className="w-24 h-24 rounded-full" />
                      <div className="grid gap-2">
                           <Skeleton className="h-10 w-28" />
                           <Skeleton className="h-4 w-48" />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                  </div>
                   <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                  </div>
                   <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                  </div>
                   <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                  </div>
                   <Skeleton className="h-10 w-32" />
              </CardContent>
          </Card>
      )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>This is how others will see you on the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="profilePhoto"
                render={() => (
                  <FormItem className="flex items-center gap-4">
                    <Avatar className="w-24 h-24 cursor-pointer">
                      <AvatarImage src={photoPreview ?? undefined} />
                      <AvatarFallback>
                        <LucideUser className="w-10 h-10" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-2">
                        <FormLabel htmlFor="photo-upload" className={cn(
                            'cursor-pointer',
                            buttonVariants({ variant: 'outline' })
                        )}>
                            Change Photo
                        </FormLabel>
                        <FormControl>
                            <Input id="photo-upload" type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                        </FormControl>
                        <FormDescription>
                            Click to upload a new profile photo.
                        </FormDescription>
                    </div>
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
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} value={field.value ?? ''}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Your address" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
