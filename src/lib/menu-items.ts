import { LayoutDashboard, BookOpen, BarChart3, Puzzle, Settings, LifeBuoy, User, BrainCircuit } from 'lucide-react';

export type MenuItem = {
  path: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
};
// Updating file 
export const menuItems: MenuItem[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    path: '/courses',
    title: 'Courses',
    icon: BookOpen,
  },
    {
    path: '/dsa',
    title: 'DSA',
    icon: BrainCircuit,
  },
  {
    path: '/analytics',
    title: 'Analytics',
    icon: BarChart3,
  },
  {
    path: '/quizzes',
    title: 'Quizzes',
    icon: Puzzle,
  },
];

export const bottomMenuItems: MenuItem[] = [
    {
      path: '/settings/profile',
      title: 'Profile',
      icon: User
    },
    {
      path: '/settings',
      title: 'Settings',
      icon: Settings,
    },
    {
      path: '/support',
      title: 'Support',
      icon: LifeBuoy,
    },
];
