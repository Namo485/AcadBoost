'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { deleteUser } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function AccountSettingsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const storage = getStorage();
    const router = useRouter();
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        if (!user || !firestore) return;
        setIsDeleting(true);

        try {
            // Delete user document from Firestore
            await deleteDoc(doc(firestore, "users", user.uid));

            // Delete profile photo from Storage
            if (user.photoURL) {
                try {
                  const photoRef = ref(storage, `profilePhotos/${user.uid}`);
                  await deleteObject(photoRef);
                } catch (storageError: any) {
                  // Log storage error but don't block account deletion
                  // e.g., if the file doesn't exist
                  if (storageError.code !== 'storage/object-not-found') {
                    console.error("Could not delete profile photo:", storageError);
                  }
                }
            }
            
            // Delete user from Firebase Auth
            await deleteUser(user);

            toast({
                title: "Account Deleted",
                description: "Your account has been permanently deleted.",
            });

            router.push("/signup");

        } catch (error: any) {
            console.error("Error deleting account:", error);
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: error.message || "An error occurred. You may need to log in again to delete your account.",
            });
            setIsDeleting(false);
        }
    };
    
    return (
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>This action is permanent and cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className={cn(buttonVariants({variant: 'destructive'}))}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
      </Card>
    )
}
