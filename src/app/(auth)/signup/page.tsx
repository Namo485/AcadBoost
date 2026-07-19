'use client';
import { SignupForm } from '@/components/auth/signup-form';
import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { BrainCircuit } from 'lucide-react';

export default function SignupPage() {
  return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-background py-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <BrainCircuit className="absolute -left-12 top-1/4 h-64 w-64 text-primary/5 opacity-50 rotate-12" />
            <BrainCircuit className="absolute -right-24 bottom-1/4 h-96 w-96 text-primary/5 opacity-50 -rotate-12" />
        </div>
        <div className="relative z-10 w-full max-w-md p-4">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
                 <Logo />
            </Link>
            <p className="text-muted-foreground mt-2 font-body">
              Join AcadBoost to start learning.
            </p>
          </div>
          <SignupForm />
           <p className="text-sm text-center text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Log in
              </Link>
            </p>
        </div>
      </div>
  );
}
