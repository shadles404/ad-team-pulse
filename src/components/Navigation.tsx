import { LayoutDashboard, UserPlus, CheckSquare, BarChart3, Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <div className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">TikTok Advertiser Tracker</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-5 bg-muted">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-card">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="registration" className="data-[state=active]:bg-card">
              <UserPlus className="mr-2 h-4 w-4" />
              Registration
            </TabsTrigger>
            <TabsTrigger value="tracking" className="data-[state=active]:bg-card">
              <CheckSquare className="mr-2 h-4 w-4" />
              Tracking
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-card">
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-card">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
