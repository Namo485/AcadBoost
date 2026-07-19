'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Palette, Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const settingsNavItems = [
  {
    href: '/settings/profile',
    label: 'Profile',
    icon: User,
  },
  {
    href: '/settings/appearance',
    label: 'Appearance',
    icon: Palette,
  },
  {
    href: '/settings/language',
    label: 'Language & Region',
    icon: Globe,
  },
  {
    href: '/settings/account',
    label: 'Account',
    icon: Lock,
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1">
      {settingsNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
            pathname === item.href && 'bg-primary/10 text-primary font-semibold'
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

// complete 
