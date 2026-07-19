'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Logo } from './logo';

import { cn } from '@/lib/utils';
import { menuItems } from '@/lib/menu-items';
import type { MenuItem } from '@/lib/menu-items';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

export default function AppSidebar() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const getInitials = (name?: string | null) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'An error occurred during logout. Please try again.',
      });
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-1">
        <TooltipProvider delayDuration={0}>
          {menuItems.map((item) => (
            <SidebarLink key={item.path} item={item} pathname={pathname} />
          ))}
        </TooltipProvider>
      </nav>
      <div className="mt-auto p-4 border-t">
        {isUserLoading ? (
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-col gap-1 overflow-hidden">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
              </div>
            </div>
        ) : (
            <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.photoURL ?? undefined} data-ai-hint="person face" />
                    <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold text-sm truncate">{user?.displayName ?? 'User'}</span>
                    <span className="text-xs text-muted-foreground truncate">{user?.email ?? 'No email'}</span>
                </div>
            </div>
        )}
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
        </Button>
      </div>
    </aside>
  );
}

function SidebarLink({ item, pathname }: { item: MenuItem; pathname: string }) {
  const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.path}
          className={cn(
            'flex items-center gap-3 rounded-lg px-4 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
            isActive && 'bg-primary/10 text-primary font-semibold'
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5} className="md:hidden">
        {item.title}
      </TooltipContent>
    </Tooltip>
  );
}
