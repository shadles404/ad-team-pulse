import { LayoutDashboard, UserPlus, CheckSquare, BarChart3, Settings, LogOut, TrendingUp, Package, DollarSign } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onSignOut: () => void;
  userRole?: "admin" | "user" | null;
  isAdmin: boolean;
}

export const Navigation = ({ activeTab, onTabChange, onSignOut, userRole, isAdmin }: NavigationProps) => {
  return (
    <div className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">TikTok Advertiser Tracker</h1>
          </div>
          <div className="flex items-center gap-3">
            {userRole && (
              <Badge variant={userRole === "admin" ? "default" : "secondary"}>
                Role: {userRole === "admin" ? "Admin" : "User"}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className={`grid w-full max-w-4xl ${isAdmin ? 'grid-cols-7' : 'grid-cols-6'} bg-muted`}>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-card">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="registration" className="data-[state=active]:bg-card">
                <UserPlus className="mr-2 h-4 w-4" />
                Registration
              </TabsTrigger>
            )}
            <TabsTrigger value="tracking" className="data-[state=active]:bg-card">
              <CheckSquare className="mr-2 h-4 w-4" />
              Tracking
            </TabsTrigger>
            <TabsTrigger value="delivery" className="data-[state=active]:bg-card">
              <Package className="mr-2 h-4 w-4" />
              Delivery
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-card">
              <DollarSign className="mr-2 h-4 w-4" />
              Payment Confirmation
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
