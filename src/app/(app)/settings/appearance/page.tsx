'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from 'next-themes';

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of the app.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Theme</Label>
            <RadioGroup
                defaultValue={theme}
                onValueChange={setTheme}
                className="grid max-w-md grid-cols-2 gap-8 pt-2"
            >
                <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value="light" id="light" className="sr-only" />
                    <span className="mb-2 block w-full rounded-sm bg-[#ecedef] p-2 text-center font-semibold">
                        Light
                    </span>
                </Label>
                <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                     <RadioGroupItem value="dark" id="dark" className="sr-only" />
                    <span className="mb-2 block w-full rounded-sm bg-[#1a202c] p-2 text-center font-semibold text-white">
                        Dark
                    </span>
                </Label>
            </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
