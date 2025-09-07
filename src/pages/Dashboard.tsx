import { useState } from "react";
import { TestConfigForm, TestConfig } from "@/components/TestConfigForm";
import { MetricsDisplay, TestMetrics } from "@/components/MetricsDisplay";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, Server } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [metrics, setMetrics] = useState<TestMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastTest, setLastTest] = useState<TestConfig | null>(null);
  const { toast } = useToast();

  // Mock function - In real app, this would call your backend
  const handleRunTest = async (config: TestConfig) => {
    setIsLoading(true);
    setLastTest(config);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock response data
      const mockMetrics: TestMetrics = {
        summary: {
          totalRequests: Math.floor(Math.random() * 10000) + 1000,
          successRate: 95 + Math.random() * 5,
          avgResponseTime: 100 + Math.random() * 200,
          p95ResponseTime: 200 + Math.random() * 300,
          rps: 50 + Math.random() * 100,
          errors: Math.floor(Math.random() * 50)
        },
        timeline: Array.from({ length: 20 }, (_, i) => ({
          timestamp: `${i * 5}s`,
          responseTime: 80 + Math.random() * 150,
          rps: 40 + Math.random() * 80,
          errors: Math.floor(Math.random() * 3)
        }))
      };

      setMetrics(mockMetrics);
      toast({
        title: "Test completed successfully",
        description: `Processed ${mockMetrics.summary.totalRequests.toLocaleString()} requests`,
      });
    } catch (error) {
      toast({
        title: "Test failed",
        description: "Unable to run performance test. Please check your configuration.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-secondary bg-clip-text text-transparent">
                  API Perf Tester
                </h1>
              </div>
              <Badge variant="outline" className="hidden sm:inline-flex">
                k6 Powered
              </Badge>
            </div>
            
            {lastTest && (
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <Server className="h-4 w-4" />
                <span>{lastTest.method}</span>
                <span className="max-w-xs truncate">{lastTest.url}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Backend Notice */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Development Mode:</strong> This demo uses mock data. To integrate with a real k6 backend, 
              you'll need to set up the Node.js/Express server that generates k6 scripts and processes results.
            </AlertDescription>
          </Alert>

          {/* Test Configuration */}
          <TestConfigForm onRunTest={handleRunTest} isLoading={isLoading} />

          {/* Loading State */}
          {isLoading && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">Running performance test...</p>
                  <p className="text-sm text-muted-foreground">
                    Testing {lastTest?.url} with {lastTest?.vus} virtual users
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {metrics && !isLoading && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Test Results</h2>
                <Badge variant="secondary" className="text-sm">
                  {lastTest?.testType} • {lastTest?.vus} VUs • {lastTest?.duration}
                </Badge>
              </div>
              <MetricsDisplay metrics={metrics} />
            </div>
          )}

          {/* Empty State */}
          {!metrics && !isLoading && (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <Activity className="h-16 w-16 text-muted-foreground mx-auto" />
                  <h3 className="text-xl font-semibold">Ready to Test</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure your API endpoint above and run a performance test to see detailed metrics and insights.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;