import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { TeamMember } from "@/types/team";
import { PaymentConfirmation } from "@/types/payment";
import { ReportsCharts } from "./ReportsCharts";
import { MonthlyReports } from "./MonthlyReports";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReportsProps {
  teamMembers: TeamMember[];
  confirmations: PaymentConfirmation[];
}

export const Reports = ({ teamMembers, confirmations }: ReportsProps) => {
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

      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="monthly">Monthly Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly">
          <MonthlyReports teamMembers={teamMembers} confirmations={confirmations} />
        </TabsContent>

        <TabsContent value="analytics">
          <ReportsCharts teamMembers={teamMembers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
