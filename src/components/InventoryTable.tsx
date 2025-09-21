import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, TrendingDown, Package, ExternalLink } from "lucide-react";
import { InventoryItem } from "./Dashboard";

interface InventoryTableProps {
  data: InventoryItem[];
}

export function InventoryTable({ data }: InventoryTableProps) {
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

  const getStockPercentage = (current: number, optimal: number) => {
    return Math.min((current / optimal) * 100, 150); // Cap at 150% for overstocked items
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "optimal": return "bg-success";
      case "understock": return "bg-warning";
      case "overstock": return "bg-info";
      case "critical": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Inventory Overview
        </CardTitle>
        <CardDescription>
          Detailed view of all inventory items with AI recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Forecast Trend</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => {
                const stockPercentage = getStockPercentage(item.currentStock, item.optimalStock);
                const nextWeekForecast = item.forecast[1] || item.currentStock;
                const trend = nextWeekForecast > item.currentStock ? "up" : "down";
                const trendColor = trend === "up" ? "text-success" : "text-destructive";
                
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${item.cost} | {item.supplier}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.currentStock} units</div>
                        <div className="text-sm text-muted-foreground">
                          Optimal: {item.optimalStock} | Reorder: {item.reorderPoint}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Progress 
                          value={stockPercentage} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {stockPercentage.toFixed(0)}% of optimal
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(item.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(item.status)}
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 ${trendColor}`}>
                        {trend === "up" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                          {Math.abs(nextWeekForecast - item.currentStock)} units
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.lastUpdated}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {(item.status === "critical" || item.status === "understock") && (
                          <Button size="sm" variant="default">
                            Reorder
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}