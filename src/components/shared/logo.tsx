import * as React from 'react';
import { cn } from '@/lib/utils';
import { BrainCircuit } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-xl font-bold font-headline text-foreground", className)}>
        <BrainCircuit className="h-7 w-7 text-primary" />
        <span>AcadBoost</span>
    </div>
  );
}
