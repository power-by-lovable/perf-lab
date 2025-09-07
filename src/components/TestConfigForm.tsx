import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlayCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface TestConfig {
  url: string;
  method: string;
  headers: string;
  body: string;
  vus: number;
  duration: string;
  testType: string;
}

interface TestConfigFormProps {
  onRunTest: (config: TestConfig) => Promise<void>;
  isLoading: boolean;
}

export const TestConfigForm = ({ onRunTest, isLoading }: TestConfigFormProps) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<TestConfig>({
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "GET",
    headers: '{"Content-Type": "application/json"}',
    body: "",
    vus: 10,
    duration: "30s",
    testType: "load"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate JSON headers
      if (config.headers.trim()) {
        JSON.parse(config.headers);
      }
      
      // Validate JSON body if not empty
      if (config.body.trim()) {
        JSON.parse(config.body);
      }
      
      await onRunTest(config);
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your headers and body JSON formatting",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-primary" />
          Test Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="url">Target URL</Label>
              <Input
                id="url"
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                placeholder="https://api.example.com/endpoint"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="method">HTTP Method</Label>
              <Select value={config.method} onValueChange={(value) => setConfig({ ...config, method: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headers">Headers (JSON)</Label>
            <Textarea
              id="headers"
              value={config.headers}
              onChange={(e) => setConfig({ ...config, headers: e.target.value })}
              placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
              className="font-mono text-sm"
              rows={3}
            />
          </div>

          {(config.method === "POST" || config.method === "PUT" || config.method === "PATCH") && (
            <div className="space-y-2">
              <Label htmlFor="body">Request Body (JSON)</Label>
              <Textarea
                id="body"
                value={config.body}
                onChange={(e) => setConfig({ ...config, body: e.target.value })}
                placeholder='{"key": "value"}'
                className="font-mono text-sm"
                rows={4}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vus">Virtual Users</Label>
              <Input
                id="vus"
                type="number"
                min="1"
                max="1000"
                value={config.vus}
                onChange={(e) => setConfig({ ...config, vus: parseInt(e.target.value) || 1 })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={config.duration}
                onChange={(e) => setConfig({ ...config, duration: e.target.value })}
                placeholder="30s, 5m, 1h"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="testType">Test Type</Label>
              <Select value={config.testType} onValueChange={(value) => setConfig({ ...config, testType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="load">Load Test</SelectItem>
                  <SelectItem value="stress">Stress Test</SelectItem>
                  <SelectItem value="spike">Spike Test</SelectItem>
                  <SelectItem value="soak">Soak Test</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-chart-secondary hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Test...
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Run Performance Test
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};