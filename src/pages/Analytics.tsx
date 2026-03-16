import { useState, useEffect } from "react";
import { MessageSquare, Users, Clock, TrendingUp, ArrowUp, ArrowDown, Bot, UserCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function Analytics() {
  const [period, setPeriod] = useState("30d");
  const [overview, setOverview] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [overviewData, trendsData, devicesData, performanceData] = await Promise.allSettled([
        api.getAnalyticsOverview(period),
        api.getConversationTrends(period),
        api.getDeviceBreakdown(),
        api.getPerformanceData(),
      ]);

      if (overviewData.status === 'fulfilled' && overviewData.value) {
        setOverview(overviewData.value);
      }
      if (trendsData.status === 'fulfilled' && trendsData.value?.conversation_trends) {
        setTrends(trendsData.value.conversation_trends);
      }
      if (devicesData.status === 'fulfilled' && devicesData.value?.devices) {
        setDevices(devicesData.value.devices);
      }
      if (performanceData.status === 'fulfilled' && performanceData.value) {
        setPerformance(performanceData.value);
      }
    } catch (err) {
      setError("Failed to load analytics data.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (!num && num !== 0) return "—";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatTime = (seconds: number) => {
    if (!seconds && seconds !== 0) return "—";
    if (seconds < 60) return `${seconds}s`;
    return `${(seconds / 60).toFixed(1)}m`;
  };

  const kpiCards = overview ? [
    {
      title: "Total Conversations",
      value: formatNumber(overview.total_conversations || 0),
      change: overview.conversation_growth_percent || 0,
      icon: MessageSquare,
      trend: (overview.conversation_growth_percent || 0) >= 0 ? "up" : "down"
    },
    {
      title: "Total Customers",
      value: formatNumber(overview.total_customers || overview.b2c_metrics?.total_customers || 0),
      change: 0,
      icon: Users,
      trend: "up"
    },
    {
      title: "Total Orders",
      value: formatNumber(overview.total_orders || overview.b2c_metrics?.total_orders || 0),
      change: 0,
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Total Revenue",
      value: "₹" + formatNumber(Math.floor((overview.total_revenue || overview.b2c_metrics?.total_revenue || 0) / 100)),
      change: 0,
      icon: TrendingUp,
      trend: "up"
    },
  ] : [];

  const resolutionRate = overview?.performance?.resolution_rate || performance?.resolution_rate || 0;
  const customerSatisfaction = overview?.performance?.customer_satisfaction || performance?.customer_satisfaction || 0;
  const avgResponseTime = overview?.performance?.avg_response_time_seconds || overview?.average_response_time_seconds || 0;

  if (isLoading) {
    return (
      <div className="h-full bg-accent/20 p-6 overflow-y-auto flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="h-full bg-accent/20 p-6 overflow-y-auto flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-destructive font-medium">{error}</p>
          <button onClick={loadAnalytics} className="text-primary underline text-sm">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-accent/20 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Track your chatbot performance and insights</p>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="b2c">B2C Metrics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            {kpiCards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((kpi, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <kpi.icon className="h-5 w-5 text-primary" />
                        </div>
                        {kpi.change !== 0 && (
                          <div className={cn(
                            "flex items-center gap-1 text-sm font-medium",
                            kpi.trend === "up" ? "text-green-600" : "text-red-600"
                          )}>
                            {kpi.trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                            {Math.abs(kpi.change)}%
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                        <p className="text-sm text-muted-foreground">{kpi.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[MessageSquare, Users, TrendingUp, Clock].map((Icon, i) => (
                  <Card key={i}><CardContent className="p-6 flex items-center justify-center h-28 text-muted-foreground text-sm">No data</CardContent></Card>
                ))}
              </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conversation Trends */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Conversation Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  {trends.length > 0 ? (
                    <>
                      <div className="h-64 flex items-end gap-4 px-4">
                        {trends.map((trend, index) => {
                          const maxConv = Math.max(...trends.map(t => t.conversations), 1);
                          const maxUsers = Math.max(...trends.map(t => t.users), 1);
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                              <div className="w-full flex gap-1 items-end h-48">
                                <div
                                  className="flex-1 bg-primary rounded-t"
                                  style={{ height: `${(trend.conversations / maxConv) * 100}%` }}
                                />
                                <div
                                  className="flex-1 bg-primary/40 rounded-t"
                                  style={{ height: `${(trend.users / maxUsers) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{trend.date}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-primary" />
                          <span className="text-sm text-muted-foreground">Conversations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-primary/40" />
                          <span className="text-sm text-muted-foreground">Users</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                      No trend data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {devices.length > 0 ? (
                    <div className="space-y-4">
                      {devices.map((device, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-foreground">{device.name}</span>
                            <span className="text-sm font-medium text-foreground">{device.value}%</span>
                          </div>
                          <div className="h-2 bg-accent rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${device.value}%`, opacity: 1 - index * 0.2 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
                      No device data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Message Breakdown */}
            {overview && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Message Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center gap-8">
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                          <ArrowDown className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">{formatNumber(overview.inbound_messages || 0)}</p>
                        <p className="text-sm text-muted-foreground">Inbound</p>
                      </div>
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-2">
                          <ArrowUp className="h-8 w-8 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">{formatNumber(overview.outbound_messages || 0)}</p>
                        <p className="text-sm text-muted-foreground">Outbound</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Avg Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-foreground">{formatTime(avgResponseTime)}</p>
                        <p className="text-sm text-muted-foreground mt-2">Average response time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="b2c" className="space-y-6">
            {overview ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-foreground">Active</span>
                          <span className="text-sm font-medium text-green-600">
                            {overview.active_customers || overview.b2c_metrics?.active_customers || 0}
                          </span>
                        </div>
                        <div className="h-2 bg-accent rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{
                              width: `${((overview.active_customers || overview.b2c_metrics?.active_customers || 0) /
                                Math.max(overview.total_customers || overview.b2c_metrics?.total_customers || 1, 1)) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-foreground">Churned</span>
                          <span className="text-sm font-medium text-red-600">
                            {overview.churned_customers || overview.b2c_metrics?.churned_customers || 0}
                          </span>
                        </div>
                        <div className="h-2 bg-accent rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{
                              width: `${((overview.churned_customers || overview.b2c_metrics?.churned_customers || 0) /
                                Math.max(overview.total_customers || overview.b2c_metrics?.total_customers || 1, 1)) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">Total Customers</p>
                        <p className="text-xl font-bold">
                          {formatNumber(overview.total_customers || overview.b2c_metrics?.total_customers || 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Order Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold text-foreground">
                          {formatNumber(overview.total_orders || overview.b2c_metrics?.total_orders || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="text-xl font-bold text-foreground">
                          ₹{formatNumber(Math.floor((overview.total_revenue || overview.b2c_metrics?.total_revenue || 0) / 100))}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground mb-2">
                        ₹{formatNumber(Math.floor((overview.total_revenue || overview.b2c_metrics?.total_revenue || 0) / 100))}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                        Based on completed orders
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                No B2C metrics available
              </div>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resolution Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="hsl(var(--accent))"
                          strokeWidth="12"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="12"
                          strokeDasharray={`${resolutionRate * 4.4} 440`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-foreground">{resolutionRate}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-5xl font-bold text-foreground mb-2">{customerSatisfaction || "—"}</p>
                    {customerSatisfaction > 0 && (
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={cn(
                              "text-2xl",
                              star <= Math.round(customerSatisfaction) ? "text-yellow-400" : "text-gray-200"
                            )}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">Based on customer feedback</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bot vs Agent Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Bot vs Agent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {performance?.comparison?.metrics && performance.comparison.metrics.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Metric</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                            <div className="flex items-center justify-center gap-2">
                              <Bot className="h-4 w-4" />
                              Bot
                            </div>
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                            <div className="flex items-center justify-center gap-2">
                              <UserCheck className="h-4 w-4" />
                              Agent
                            </div>
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Comparison</th>
                        </tr>
                      </thead>
                      <tbody>
                        {performance.comparison.metrics.map((metric: any, index: number) => (
                          <tr key={index} className="border-b border-border">
                            <td className="py-4 px-4 text-sm text-foreground">{metric.name}</td>
                            <td className={cn(
                              "py-4 px-4 text-sm text-center font-medium",
                              metric.winner === "bot" ? "text-green-600" : "text-foreground"
                            )}>
                              {metric.bot}
                            </td>
                            <td className={cn(
                              "py-4 px-4 text-sm text-center font-medium",
                              metric.winner === "agent" ? "text-green-600" : "text-foreground"
                            )}>
                              {metric.agent}
                            </td>
                            <td className="py-4 px-4 text-sm text-muted-foreground">{metric.comparison}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
                    No comparison data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}