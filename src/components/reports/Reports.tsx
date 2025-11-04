import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { TeamMember } from "@/types/team";
import { ReportsCharts } from "./ReportsCharts";

interface ReportsProps {
  teamMembers: TeamMember[];
}

export const Reports = ({ teamMembers }: ReportsProps) => {
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
            Comprehensive analytics and insights for your advertising team performance.
          </p>
        </CardContent>
      </Card>

      <ReportsCharts teamMembers={teamMembers} />
    </div>
  );
};
