import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export const Reports = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Reports & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Advanced reporting features coming soon. This section will include:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Performance trends over time</li>
            <li>Individual team member reports</li>
            <li>Ad campaign effectiveness analysis</li>
            <li>Platform-specific metrics</li>
            <li>Custom date range filtering</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
