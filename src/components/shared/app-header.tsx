'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, GraduationCap, Bell } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { menuItems } from '@/lib/menu-items';
import type { MenuItem } from '@/lib/menu-items';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/shared/logo';


export default function AppHeader() {
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
    <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 sticky top-0 z-30">
        {/* Mobile Sidebar */}
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
                <SheetHeader className="h-16 flex flex-row items-center px-6 border-b">
                    <Link href="/dashboard">
                      <Logo />
                    </Link>
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                </SheetHeader>
                <nav className="grid gap-2 text-lg font-medium p-4">
                    {menuItems.map((item) => (
                        <MobileSidebarLink key={item.path} item={item} pathname={pathname} />
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
        
        <div className="w-full flex-1">
          {/* Future search bar can go here */}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.photoURL ?? undefined} data-ai-hint="person face" />
                            <AvatarFallback>{isUserLoading ? '' : getInitials(user?.displayName)}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user?.displayName ?? 'User'}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user?.email ?? 'No email'}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                      <Link href="/settings/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings/profile">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>
  );
}


function MobileSidebarLink({ item, pathname }: { item: MenuItem; pathname: string }) {
    const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
  
    return (
      <Link
        href={item.path}
        className={cn(
          'flex items-center gap-4 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground',
          isActive && 'bg-muted text-foreground'
        )}
      >
        <item.icon className="h-5 w-5" />
        {item.title}
      </Link>
    );
  }
