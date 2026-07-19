import { SettingsSidebar } from '@/components/settings/settings-sidebar';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-1">
        <SettingsSidebar />
      </div>
      <div className="md:col-span-3">
        {children}
      </div>
    </div>
  );
}
