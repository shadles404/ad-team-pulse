import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, DollarSign, Users, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { TeamMember } from "@/types/team";
import { PaymentConfirmation } from "@/types/payment";
import { format } from "date-fns";
import { toast } from "sonner";

interface MonthlyReportsProps {
  teamMembers: TeamMember[];
  confirmations: PaymentConfirmation[];
}

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export const MonthlyReports = ({ teamMembers, confirmations }: MonthlyReportsProps) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }, []);

  // Filter payments for selected month/year
  const filteredPayments = useMemo(() => {
    return confirmations.filter(c => c.month === selectedMonth && c.year === selectedYear);
  }, [confirmations, selectedMonth, selectedYear]);

  // Payment statistics
  const paymentStats = useMemo(() => {
    const total = filteredPayments.length;
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.salary, 0);
    const paid = filteredPayments.filter(p => p.payment_status === 'paid').length;
    const pending = filteredPayments.filter(p => p.payment_status === 'pending').length;

    return { total, totalAmount, paid, pending };
  }, [filteredPayments]);

  // Performance data
  const performanceData = useMemo(() => {
    return teamMembers.map(member => {
      const completed = member.progressChecks.filter(Boolean).length;
      const isCompleted = completed >= member.targetVideos;
      return {
        id: member.id,
        name: member.description,
        phone: member.phone,
        targetVideos: member.targetVideos,
        completedVideos: completed,
        isCompleted,
        salary: member.salary,
      };
    });
  }, [teamMembers]);

  const completedCount = performanceData.filter(p => p.isCompleted).length;
  const incompleteCount = performanceData.filter(p => !p.isCompleted).length;
  const completionPercentage = teamMembers.length > 0 
    ? ((completedCount / teamMembers.length) * 100).toFixed(1) 
    : "0";

  const exportPaymentsCSV = () => {
    const headers = ["Influencer Name", "Phone", "Salary", "Month", "Year", "Payment Status", "Payment Date"];
    const rows = filteredPayments.map(p => [
      p.celebrity_name,
      p.phone_number,
      p.salary,
      MONTHS.find(m => m.value === p.month)?.label || "",
      p.year,
      p.payment_status,
      p.confirmed_at ? format(new Date(p.confirmed_at), "MMM dd, yyyy") : "-"
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-report-${MONTHS.find(m => m.value === selectedMonth)?.label}-${selectedYear}.csv`;
    a.click();
    toast.success("Payments report exported!");
  };

  const exportPerformanceCSV = () => {
    const headers = ["Influencer Name", "Target Videos", "Completed Videos", "Status"];
    const rows = performanceData.map(p => [
      p.name,
      p.targetVideos,
      p.completedVideos,
      p.isCompleted ? "Completed" : "Incomplete"
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-report-${MONTHS.find(m => m.value === selectedMonth)?.label}-${selectedYear}.csv`;
    a.click();
    toast.success("Performance report exported!");
  };

  return (
    <div className="space-y-6">
      {/* Month/Year Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Month:</span>
              <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map(month => (
                    <SelectItem key={month.value} value={String(month.value)}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Year:</span>
              <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="payments">Payments Report</TabsTrigger>
          <TabsTrigger value="performance">Performance Report</TabsTrigger>
        </TabsList>

        {/* Payments Report Tab */}
        <TabsContent value="payments" className="space-y-4">
          {/* Payment Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Influencers</p>
                    <p className="text-2xl font-bold">{paymentStats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <DollarSign className="h-8 w-8 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">${paymentStats.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">Paid</p>
                    <p className="text-2xl font-bold">{paymentStats.paid}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <XCircle className="h-8 w-8 text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{paymentStats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payments Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment Details</CardTitle>
              <Button onClick={exportPaymentsCSV} variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Influencer Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead>Month</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Payment Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No payment records for this month
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.celebrity_name}</TableCell>
                            <TableCell>{payment.phone_number}</TableCell>
                            <TableCell>${payment.salary.toLocaleString()}</TableCell>
                            <TableCell>{MONTHS.find(m => m.value === payment.month)?.label} {payment.year}</TableCell>
                            <TableCell>
                              <Badge variant={payment.payment_status === 'paid' ? 'default' : 'secondary'} 
                                className={payment.payment_status === 'paid' ? 'bg-success' : 'bg-warning'}>
                                {payment.payment_status === 'paid' ? 'Paid' : 'Pending'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {payment.confirmed_at ? format(new Date(payment.confirmed_at), "MMM dd, yyyy") : "-"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Report Tab */}
        <TabsContent value="performance" className="space-y-4">
          {/* Performance Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Target</p>
                    <p className="text-2xl font-bold">{completedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <XCircle className="h-8 w-8 text-destructive" />
                  <div>
                    <p className="text-sm text-muted-foreground">Did Not Complete</p>
                    <p className="text-2xl font-bold">{incompleteCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">{completionPercentage}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Performance Details</CardTitle>
              <Button onClick={exportPerformanceCSV} variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Influencer Name</TableHead>
                        <TableHead>Target Videos</TableHead>
                        <TableHead>Completed Videos</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {performanceData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No team members found
                          </TableCell>
                        </TableRow>
                      ) : (
                        performanceData.map((member) => (
                          <TableRow key={member.id} className={member.isCompleted ? "bg-success-light/30" : "bg-destructive-light/20"}>
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>{member.targetVideos}</TableCell>
                            <TableCell>{member.completedVideos}</TableCell>
                            <TableCell>
                              <Badge variant="default" className={member.isCompleted ? "bg-success" : "bg-destructive"}>
                                {member.isCompleted ? (
                                  <><CheckCircle className="h-3 w-3 mr-1" /> Completed</>
                                ) : (
                                  <><XCircle className="h-3 w-3 mr-1" /> Incomplete</>
                                )}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
