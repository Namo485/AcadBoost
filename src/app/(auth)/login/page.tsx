'use client';
import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { BrainCircuit } from 'lucide-react';

export default function LoginPage() {
  return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-background overflow-hidden">
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
              Elevate your learning experience.
            </p>
          </div>
          <LoginForm />
          <p className="text-sm text-center text-muted-foreground mt-4">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
        </div>
      </div>
  );
}
