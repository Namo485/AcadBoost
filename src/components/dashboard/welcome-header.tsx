'use client';

import { Button } from '../ui/button';
import { BookPlus } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';

export function WelcomeHeader() {
  const { user } = useUser();

  const getFirstName = () => {
    if (!user || !user.displayName) return 'There';
    return user.displayName.split(' ')[0];
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
            <h1 className="text-3xl md:text-4xl font-headline font-bold">Welcome Back, {getFirstName()}!</h1>
            <p className="mt-1 text-muted-foreground">Here's your learning snapshot for today.</p>
        </div>
        <Button asChild className="mt-4 sm:mt-0">
            <Link href="/courses">
                <BookPlus className="mr-2 h-4 w-4" />
                Explore Courses
            </Link>
        </Button>
    </div>
  );
}
