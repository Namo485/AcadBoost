'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function LanguageSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Language & Region</CardTitle>
        <CardDescription>
            Manage your language and timezone preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Language</Label>
             <Select defaultValue="en">
                <SelectTrigger className="w-full md:w-1/2">
                    <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English (United States)</SelectItem>
                    <SelectItem value="es">Español (España)</SelectItem>
                    <SelectItem value="fr">Français (France)</SelectItem>
                    <SelectItem value="de">Deutsch (Deutschland)</SelectItem>
                    <SelectItem value="hi">हिन्दी (भारत)</SelectItem>
                </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
                This will be the default language for the application.
            </p>
        </div>
         <div className="space-y-2">
            <Label>Timezone</Label>
             <Select defaultValue="est">
                <SelectTrigger className="w-full md:w-1/2">
                    <SelectValue placeholder="Select a timezone" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                    <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                    <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                    <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                    <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                </SelectContent>
            </Select>
             <p className="text-sm text-muted-foreground">
                Your timezone is used to display dates and times correctly.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
