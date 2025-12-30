import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";

const ProgressBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data - in real app this would come from API
  const blockers = [
    {
      id: 1,
      blocker: "Approval process slowed deployment",
      proposedFix: "Implement auto-approval for low-risk changes",
      owner: "DevOps Team",
      status: "in-progress",
      tiedValue: "Move Fast, Chase Excellence",
      lastUpdated: "2 hours ago",
      criticality: "medium",
      weekStart: "2024-01-08"
    },
    {
      id: 2,
      blocker: "Design review bottleneck",
      proposedFix: "Add async review process with 24h SLA",
      owner: "Design Team",
      status: "solution-decided",
      tiedValue: "Invent & Simplify",
      lastUpdated: "1 day ago",
      criticality: "high",
      weekStart: "2024-01-08"
    },
    {
      id: 3,
      blocker: "Cross-team communication gaps",
      proposedFix: "Weekly sync meetings between teams",
      owner: "Engineering Leads",
      status: "submitted",
      tiedValue: "The Dream Team",
      lastUpdated: "3 hours ago",
      criticality: "low",
      weekStart: "2024-01-01"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "acknowledged": return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "solution-decided": return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case "in-progress": return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case "done": return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "low": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-orange-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const filteredBlockers = blockers.filter(blocker => {
    const matchesSearch = blocker.blocker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blocker.proposedFix.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || blocker.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      {/* Version badge and theme toggle */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
        <Badge variant="outline" className="px-3 py-1 font-semibold glass-panel">
          v1
        </Badge>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <TrendingUp className="w-10 h-10 text-primary" />
              QPT Progress Board
            </h1>
            <p className="text-lg text-muted-foreground">
              Track blockers from problem to solution — QPT only
            </p>
          </div>

          {/* Filters */}
          <div className="card-premium mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search blockers or solutions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="solution-decided">Solution Decided</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Status summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { status: "submitted", count: 1, color: "text-yellow-500" },
              { status: "acknowledged", count: 0, color: "text-blue-500" },
              { status: "solution-decided", count: 1, color: "text-purple-500" },
              { status: "in-progress", count: 1, color: "text-orange-500" },
              { status: "done", count: 0, color: "text-green-500" }
            ].map((item, index) => (
              <Card key={item.status} className="card-section animate-slide-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {getStatusLabel(item.status)}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Blockers list */}
          <div className="space-y-6">
            {filteredBlockers.map((blocker, index) => (
              <Card key={blocker.id} className="card-premium animate-slide-up" style={{ animationDelay: `${0.7 + index * 0.1}s` }}>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(blocker.status)}
                      <div>
                        <Badge variant="outline" className="text-xs">
                          {getStatusLabel(blocker.status)}
                        </Badge>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${getCriticalityColor(blocker.criticality)}`}></div>
                          <span className="text-xs text-muted-foreground capitalize">{blocker.criticality} priority</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{blocker.lastUpdated}</span>
                  </div>

                  {/* Content */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">BLOCKER</h4>
                      <p className="text-foreground">{blocker.blocker}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">PROPOSED FIX</h4>
                      <p className="text-foreground">{blocker.proposedFix}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">OWNER</h4>
                      <p className="text-foreground">{blocker.owner}</p>
                    </div>
                  </div>

                  {/* Tied value */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">Tied to:</span>
                    <Badge variant="secondary" className="text-xs">
                      {blocker.tiedValue}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty state */}
          {filteredBlockers.length === 0 && (
            <div className="text-center py-12 animate-slide-up">
              <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No blockers found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "All clear! No blockers match your current filters."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBoard;