import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Activity, Clock, Zap, TrendingUp } from "lucide-react";

export interface TestMetrics {
  summary: {
    totalRequests: number;
    successRate: number;
    avgResponseTime: number;
    p95ResponseTime: number;
    rps: number;
    errors: number;
  };
  timeline: Array<{
    timestamp: string;
    responseTime: number;
    rps: number;
    errors: number;
  }>;
}

interface MetricsDisplayProps {
  metrics: TestMetrics;
}

export const MetricsDisplay = ({ metrics }: MetricsDisplayProps) => {
  const { summary, timeline } = metrics;
  
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 99) return "text-chart-success";
    if (rate >= 95) return "text-chart-warning";
    return "text-chart-error";
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{summary.totalRequests.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-success">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-chart-success" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className={`text-2xl font-bold ${getSuccessRateColor(summary.successRate)}`}>
                  {summary.successRate.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-secondary">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-chart-secondary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{formatDuration(summary.avgResponseTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-warning">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-chart-warning" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Requests/sec</p>
                <p className="text-2xl font-bold">{summary.rps.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">P95 Response Time</span>
              <Badge variant="outline">{formatDuration(summary.p95ResponseTime)}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Errors</span>
              <Badge variant={summary.errors > 0 ? "destructive" : "secondary"}>
                {summary.errors}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Error Rate</span>
              <Badge variant={summary.errors > 0 ? "destructive" : "secondary"}>
                {((summary.errors / summary.totalRequests) * 100).toFixed(2)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Response Time Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="hsl(var(--chart-primary))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Requests Per Second</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                />
                <Bar 
                  dataKey="rps" 
                  fill="hsl(var(--chart-secondary))"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Error Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="errors" 
                  stroke="hsl(var(--chart-error))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-error))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};