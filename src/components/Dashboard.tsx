import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryChart } from "./InventoryChart";
import { InventoryTable } from "./InventoryTable";
import { NotificationCenter } from "./NotificationCenter";
import { AlertTriangle, TrendingUp, TrendingDown, Package, Bell, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  optimalStock: number;
  reorderPoint: number;
  status: "optimal" | "understock" | "overstock" | "critical";
  forecast: number[];
  category: string;
  lastUpdated: string;
  supplier: string;
  cost: number;
}

const mockData: InventoryItem[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    currentStock: 45,
    optimalStock: 100,
    reorderPoint: 50,
    status: "understock",
    forecast: [45, 42, 38, 35, 32, 28, 25, 35, 55, 75, 90, 100],
    category: "Electronics",
    lastUpdated: "2 hours ago",
    supplier: "TechCorp",
    cost: 89.99
  },
  {
    id: "2",
    name: "Gaming Keyboard RGB",
    currentStock: 180,
    optimalStock: 120,
    reorderPoint: 40,
    status: "overstock",
    forecast: [180, 175, 160, 145, 130, 115, 100, 85, 70, 55, 40, 60],
    category: "Electronics",
    lastUpdated: "1 hour ago",
    supplier: "GameTech",
    cost: 129.99
  },
  {
    id: "3",
    name: "Smart Water Bottle",
    currentStock: 85,
    optimalStock: 90,
    reorderPoint: 30,
    status: "optimal",
    forecast: [85, 82, 79, 76, 73, 70, 67, 64, 61, 58, 55, 70],
    category: "Lifestyle",
    lastUpdated: "30 min ago",
    supplier: "LifeStyle Co",
    cost: 45.99
  },
  {
    id: "4",
    name: "Portable Charger 20000mAh",
    currentStock: 15,
    optimalStock: 80,
    reorderPoint: 25,
    status: "critical",
    forecast: [15, 12, 9, 6, 3, 0, 25, 45, 65, 80, 75, 70],
    category: "Electronics",
    lastUpdated: "5 min ago",
    supplier: "PowerTech",
    cost: 39.99
  }
];

export function Dashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockData);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate AI risk detection
    const detectRisks = () => {
      const criticalItems = inventory.filter(item => item.status === "critical");
      const understockedItems = inventory.filter(item => item.status === "understock");
      const overstockedItems = inventory.filter(item => item.status === "overstock");

      if (criticalItems.length > 0) {
        const criticalItem = criticalItems[0];
        toast({
          title: "🚨 Critical Stock Alert",
          description: `${criticalItem.name} is critically low (${criticalItem.currentStock} units)`,
          variant: "destructive",
        });
      }
    };

    detectRisks();
    const interval = setInterval(detectRisks, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [inventory, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal": return "bg-success text-success-foreground";
      case "understock": return "bg-warning text-warning-foreground";
      case "overstock": return "bg-info text-info-foreground";
      case "critical": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "optimal": return <TrendingUp className="h-4 w-4" />;
      case "understock": return <TrendingDown className="h-4 w-4" />;
      case "overstock": return <Package className="h-4 w-4" />;
      case "critical": return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0);
  const criticalItems = inventory.filter(item => item.status === "critical").length;
  const understockedItems = inventory.filter(item => item.status === "understock").length;
  const overstockedItems = inventory.filter(item => item.status === "overstock").length;
  const optimalItems = inventory.filter(item => item.status === "optimal").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">InventoryAI</span>
          </div>
          
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Inventory Optimization Dashboard</h1>
            <p className="text-muted-foreground">AI-powered insights for optimal inventory management</p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{criticalItems}</div>
                <p className="text-xs text-muted-foreground">
                  Immediate attention required
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Understocked</CardTitle>
                <TrendingDown className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{understockedItems}</div>
                <p className="text-xs text-muted-foreground">
                  Below optimal levels
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overstocked</CardTitle>
                <TrendingUp className="h-4 w-4 text-info" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-info">{overstockedItems}</div>
                <p className="text-xs text-muted-foreground">
                  Above optimal levels
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Optimization Trends</CardTitle>
                    <CardDescription>
                      AI forecasting for next 12 weeks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InventoryChart data={inventory} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Distribution</CardTitle>
                    <CardDescription>
                      Current inventory status breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 bg-success rounded-full"></div>
                          <span className="text-sm">Optimal</span>
                        </div>
                        <Badge className={getStatusColor("optimal")}>
                          {optimalItems} items
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 bg-warning rounded-full"></div>
                          <span className="text-sm">Understocked</span>
                        </div>
                        <Badge className={getStatusColor("understock")}>
                          {understockedItems} items
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 bg-info rounded-full"></div>
                          <span className="text-sm">Overstocked</span>
                        </div>
                        <Badge className={getStatusColor("overstock")}>
                          {overstockedItems} items
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 bg-destructive rounded-full"></div>
                          <span className="text-sm">Critical</span>
                        </div>
                        <Badge className={getStatusColor("critical")}>
                          {criticalItems} items
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <InventoryTable data={inventory} />
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Analytics</CardTitle>
                  <CardDescription>
                    Detailed inventory analysis and predictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InventoryChart data={inventory} showAdvanced={true} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationCenter inventory={inventory} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}