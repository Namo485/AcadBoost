import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { EnrolledCourses } from '@/components/dashboard/enrolled-courses';
import { Recommendations } from '@/components/dashboard/recommendations';
// Dashboard Design 
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <WelcomeHeader />
      <StatsCards />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <EnrolledCourses />
        </div>
        <div>
            <Recommendations />
        </div>
      </div>
      <ProgressChart />
    </div>
  );
}
