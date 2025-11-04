import { useState } from "react";
import { TeamMember } from "@/types/team";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, isWithinInterval, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

interface ReportsChartsProps {
  teamMembers: TeamMember[];
}

const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
const PLATFORM_COLORS = {
  'Facebook': '#1877F2',
  'Instagram': '#E4405F',
  'TikTok': '#000000',
  'YouTube': '#FF0000'
};

export const ReportsCharts = ({ teamMembers }: ReportsChartsProps) => {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });

  // Filter members by date range if selected
  const filteredMembers = teamMembers;

  // Performance trends - completion rates over time (simulated monthly data)
  const performanceTrends = [
    { month: 'Jan', completionRate: 65, targetReached: 12 },
    { month: 'Feb', completionRate: 72, targetReached: 15 },
    { month: 'Mar', completionRate: 68, targetReached: 14 },
    { month: 'Apr', completionRate: 85, targetReached: 18 },
    { month: 'May', completionRate: 78, targetReached: 16 },
    { month: 'Jun', completionRate: 82, targetReached: 17 }
  ];

  // Individual team member performance
  const memberPerformance = filteredMembers.map(member => {
    const completed = member.progressChecks.filter(Boolean).length;
    const completionRate = member.targetVideos > 0 ? (completed / member.targetVideos) * 100 : 0;
    return {
      name: member.description,
      completed,
      target: member.targetVideos,
      completionRate: completionRate.toFixed(1),
      salary: member.salary,
      contractType: member.contractType
    };
  }).sort((a, b) => parseFloat(b.completionRate) - parseFloat(a.completionRate));

  // Ad campaign effectiveness by type
  const adCampaignData = filteredMembers.reduce((acc, member) => {
    member.advertisementTypes.forEach(adType => {
      const existing = acc.find(item => item.type === adType);
      const completed = member.progressChecks.filter(Boolean).length;
      
      if (existing) {
        existing.totalVideos += completed;
        existing.teamMembers += 1;
      } else {
        acc.push({
          type: adType,
          totalVideos: completed,
          teamMembers: 1
        });
      }
    });
    return acc;
  }, [] as { type: string; totalVideos: number; teamMembers: number }[]);

  // Platform-specific metrics
  const platformMetrics = filteredMembers.reduce((acc, member) => {
    const existing = acc.find(item => item.platform === member.platform);
    const completed = member.progressChecks.filter(Boolean).length;
    const targetReached = completed >= member.targetVideos;
    
    if (existing) {
      existing.totalVideos += completed;
      existing.targetVideos += member.targetVideos;
      existing.teamMembers += 1;
      existing.completedTargets += targetReached ? 1 : 0;
    } else {
      acc.push({
        platform: member.platform,
        totalVideos: completed,
        targetVideos: member.targetVideos,
        teamMembers: 1,
        completedTargets: targetReached ? 1 : 0
      });
    }
    return acc;
  }, [] as { platform: string; totalVideos: number; targetVideos: number; teamMembers: number; completedTargets: number }[]);

  // Contract type analysis
  const contractAnalysis = filteredMembers.reduce((acc, member) => {
    const existing = acc.find(item => item.contract === member.contractType);
    const completed = member.progressChecks.filter(Boolean).length;
    
    if (existing) {
      existing.members += 1;
      existing.totalSalary += member.salary;
      existing.videosCompleted += completed;
    } else {
      acc.push({
        contract: member.contractType,
        members: 1,
        totalSalary: member.salary,
        videosCompleted: completed
      });
    }
    return acc;
  }, [] as { contract: string; members: number; totalSalary: number; videosCompleted: number }[]);

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Custom Date Range Filter</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[300px] justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
      </Card>

      {/* Performance Trends Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="completionRate" stroke="#0EA5E9" name="Completion Rate (%)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="targetReached" stroke="#10B981" name="Targets Reached" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Individual Team Member Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Team Member Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={memberPerformance.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#0EA5E9" name="Completed" />
                <Bar dataKey="target" fill="#10B981" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ad Campaign Effectiveness */}
        <Card>
          <CardHeader>
            <CardTitle>Ad Campaign Effectiveness Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={adCampaignData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalVideos" fill="#8B5CF6" name="Total Videos" />
                <Bar dataKey="teamMembers" fill="#EC4899" name="Team Members" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Platform-Specific Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Platform-Specific Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalVideos" fill="#0EA5E9" name="Videos Completed" />
                <Bar dataKey="targetVideos" fill="#10B981" name="Target Videos" />
              </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={platformMetrics}>
                <PolarGrid />
                <PolarAngleAxis dataKey="platform" />
                <PolarRadiusAxis />
                <Radar name="Team Members" dataKey="teamMembers" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                <Radar name="Completed Targets" dataKey="completedTargets" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Contract Type Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contract Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contractAnalysis}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.contract} (${entry.members})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="members"
                >
                  {contractAnalysis.map((entry, index) => (
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
            <CardTitle>Contract Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contractAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="contract" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="videosCompleted" fill="#F59E0B" name="Videos Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
