import AppSidebar from '@/components/shared/app-sidebar';
import AppHeader from '@/components/shared/app-header';
import { EduChatbot } from '@/components/shared/chatbot';
import { UserTimeTracker } from '@/components/dashboard/user-time-tracker';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader />
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
      <EduChatbot />
      <UserTimeTracker />
    </div>
  );
}
