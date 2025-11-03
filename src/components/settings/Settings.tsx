import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export const Settings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Settings & Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Customization options coming soon. This section will include:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>User profile management</li>
            <li>Notification preferences</li>
            <li>Custom target thresholds</li>
            <li>Team member role permissions</li>
            <li>Export format preferences</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
