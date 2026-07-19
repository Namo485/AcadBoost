'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent_30%"></div>
      <div className="relative z-10 w-full max-w-md p-4">
        <Card className="shadow-2xl shadow-primary/10 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full p-4 mb-4 mx-auto w-fit">
                <MailCheck className="h-10 w-10" />
            </div>
            <CardTitle className="text-3xl font-headline">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a verification link to{' '}
              <span className="font-semibold text-foreground">{email || 'your email address'}</span>.
              Please check your inbox and click the link to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-center text-muted-foreground">
                Once verified, you can log in to your account.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push('/login')}>
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}


export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    )
}


// emailverfied
