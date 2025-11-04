import { Users, DollarSign, Video, TrendingUp } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMember } from "@/types/team";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface DashboardProps {
  teamMembers: TeamMember[];
}

const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const Dashboard = ({ teamMembers }: DashboardProps) => {
  const totalMembers = teamMembers.length;
  const totalSalary = teamMembers.reduce((sum, member) => sum + member.salary, 0);
  const totalCompleted = teamMembers.reduce((sum, member) => sum + member.progressChecks.filter(Boolean).length, 0);
  const totalTarget = teamMembers.reduce((sum, member) => sum + member.targetVideos, 0);
  const completionRate = totalTarget > 0 ? ((totalCompleted / totalTarget) * 100).toFixed(1) : 0;

  // Data for ads by type
  const adTypeData = teamMembers.reduce((acc, member) => {
    member.advertisementTypes.forEach(adType => {
      const existing = acc.find(item => item.name === adType);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: adType, value: 1 });
      }
    });
    return acc;
  }, [] as { name: string; value: number }[]);

  // Data for completion by member
  const completionData = teamMembers.map(member => {
    const completed = member.progressChecks.filter(Boolean).length;
    return {
      name: member.description,
      completed,
      target: member.targetVideos,
      rate: member.targetVideos > 0 ? ((completed / member.targetVideos) * 100).toFixed(0) : 0
    };
  }).slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Team Members"
          value={totalMembers}
          icon={Users}
        />
        <StatsCard
          title="Total Salary Budget"
          value={`$${totalSalary.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatsCard
          title="Videos Completed"
          value={totalCompleted}
          icon={Video}
          trend={`${totalCompleted} of ${totalTarget} target`}
        />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ads by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={adTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {adTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Target Completion by Member</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#0EA5E9" name="Completed" />
                <Bar dataKey="target" fill="#10B981" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
