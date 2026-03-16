import { Settings as SettingsIcon, ArrowUpRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState([
    { label: "Number of calls", value: "0", underline: true },
    { label: "Average duration", value: "0:00" },
    { label: "Total cost", value: "0", suffix: "credits" },
    { label: "Average cost", value: "0", suffix: "credits/call" },
    { label: "Total LLM cost", value: "$0" },
    { label: "Average LLM cost", value: "$0", suffix: "/min" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getDashboardStats('month');
      // Map API response to stats format
      // Assuming structure from API matches somewhat or I adapt it.
      // Since I don't know the EXACT response structure of /dashboard/stats other than it exists, 
      // I will assume it returns keys that I can map.
      // If the user didn't specify the response text, I will try to map common fields or just dump it for now if needed.
      // But user said "no chnages in ui", so I keep the UI elements.

      if (data) {
        // This mapping depends on what the API actually returns. 
        // For now, I'll assume it returns something I can put here.
        // Given I don't have the response schema in the prompt, I will try to map generic fields if present.
        // Or just leave the structure but populating with data if available.

        const newStats = [
          { label: "Number of calls", value: data.total_calls?.toString() || "0", underline: true },
          { label: "Average duration", value: data.avg_duration || "0:00" },
          { label: "Total cost", value: data.total_cost?.toString() || "0", suffix: "credits" },
          { label: "Average cost", value: data.avg_cost?.toString() || "0", suffix: "credits/call" },
          { label: "Total LLM cost", value: `$${data.total_llm_cost || 0}` },
          { label: "Average LLM cost", value: `$${data.avg_llm_cost || 0}`, suffix: "/min" },
        ];
        setStats(newStats);
      }
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-background p-6">
      <div className="p-6">
        {/* Status Bar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-full text-sm">
            <span className="w-2 h-2 rounded-full bg-chart-2" />
            Active calls: 0
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-new">New</span>
            <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              View new features
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="ml-auto">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SettingsIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-1">A.'s Workspace</p>
          <h1 className="text-3xl font-semibold text-foreground">Good afternoon, A.</h1>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <Select defaultValue="all">
            <SelectTrigger className="w-32 h-9">
              <SelectValue placeholder="All agents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All agents</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="month">
            <SelectTrigger className="w-32 h-9">
              <SelectValue placeholder="Last month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last week</SelectItem>
              <SelectItem value="month">Last month</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-6 gap-0 border-b border-border mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="py-4 pr-6">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-xl font-medium text-foreground ${stat.underline ? 'border-b-2 border-foreground inline-block' : ''}`}>
                {stat.value}
                {stat.suffix && <span className="text-xs text-muted-foreground ml-1">{stat.suffix}</span>}
              </p>
            </div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="relative h-64 mb-6">
          <div className="absolute left-0 top-0 text-xs text-muted-foreground">2</div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">1</div>
          <div className="absolute left-0 bottom-0 text-xs text-muted-foreground">0</div>

          <div className="ml-8 h-full border-l border-b border-border relative">
            {/* Chart line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-chart-1" />

            {/* Data point */}
            <div className="absolute bottom-0 right-1/4 w-2 h-2 rounded-full bg-chart-1 border-2 border-background" />

            {/* X-axis labels */}
            <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">Dec 20</div>
            <div className="absolute -bottom-6 right-0 text-xs text-muted-foreground">Jan 20</div>
          </div>
        </div>

        {/* View calls button */}
        <div className="flex justify-end mb-8">
          <Button variant="outline" size="sm" className="gap-2">
            View calls
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>

        {/* Two Column Cards */}
        <div className="grid grid-cols-2 gap-6">
          {/* Overall success rate */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-medium text-foreground">Overall success rate</h3>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-semibold text-foreground mb-6">0%</p>

              <div className="h-40 relative">
                <div className="absolute left-0 top-0 text-xs text-muted-foreground">100%</div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">50%</div>
                <div className="absolute left-0 bottom-0 text-xs text-muted-foreground">0%</div>

                <div className="ml-10 h-full border-b border-border relative">
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-chart-2" />
                  <div className="absolute bottom-0 left-1/4 w-2 h-2 rounded-full bg-chart-2 border-2 border-background" />
                </div>

                <div className="flex justify-between mt-2 ml-10">
                  <span className="text-xs text-muted-foreground">Dec 20</span>
                  <span className="text-xs text-muted-foreground">Jan 20</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Filter</span>
                <Select defaultValue="success">
                  <SelectTrigger className="w-28 h-8 text-sm">
                    <SelectValue placeholder="Success" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failure">Failure</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="ml-auto gap-2">
                  View calls
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-col gap-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                  <span className="text-muted-foreground">Unknown</span>
                  <span className="ml-auto">0 (0%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Failure</span>
                  <span className="ml-auto">0 (0%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-chart-2" />
                  <span className="text-muted-foreground">Success</span>
                  <span className="ml-auto">0 (0%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Most called agents */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-foreground">Most called agents</h3>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <Select defaultValue="calls">
                  <SelectTrigger className="w-20 h-8 text-sm">
                    <SelectValue placeholder="Calls" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calls">Calls</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-center h-48 text-center">
                <p className="text-sm text-muted-foreground">No agent data has been collected</p>
              </div>

              <div className="flex justify-end mt-4">
                <Button variant="ghost" size="sm" className="text-muted-foreground" disabled>
                  Show all
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Language Section */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground">Language</h3>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
