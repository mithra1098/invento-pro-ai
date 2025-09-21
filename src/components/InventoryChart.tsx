import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { InventoryItem } from "./Dashboard";

interface InventoryChartProps {
  data: InventoryItem[];
  showAdvanced?: boolean;
}

export function InventoryChart({ data, showAdvanced = false }: InventoryChartProps) {
  // Transform data for chart
  const chartData = Array.from({ length: 12 }, (_, index) => {
    const week = index + 1;
    const weekData: any = { week: `Week ${week}` };
    
    data.forEach(item => {
      weekData[item.name] = item.forecast[index] || 0;
      weekData[`${item.name}_optimal`] = item.optimalStock;
      weekData[`${item.name}_reorder`] = item.reorderPoint;
    });
    
    return weekData;
  });

  const chartConfig = {
    "Premium Wireless Headphones": {
      label: "Premium Wireless Headphones",
      color: "hsl(var(--primary))",
    },
    "Gaming Keyboard RGB": {
      label: "Gaming Keyboard RGB", 
      color: "hsl(var(--info))",
    },
    "Smart Water Bottle": {
      label: "Smart Water Bottle",
      color: "hsl(var(--success))",
    },
    "Portable Charger 20000mAh": {
      label: "Portable Charger 20000mAh",
      color: "hsl(var(--warning))",
    },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => {
            if (entry.dataKey.includes('_optimal') || entry.dataKey.includes('_reorder')) return null;
            
            const item = data.find(item => item.name === entry.dataKey);
            const currentValue = entry.value;
            const optimal = item?.optimalStock || 0;
            const reorder = item?.reorderPoint || 0;
            
            let status = "optimal";
            if (currentValue <= reorder) status = "critical";
            else if (currentValue < optimal * 0.7) status = "understock";
            else if (currentValue > optimal * 1.3) status = "overstock";
            
            const statusColors = {
              optimal: "text-success",
              understock: "text-warning", 
              overstock: "text-info",
              critical: "text-destructive"
            };
            
            return (
              <div key={index} className="flex items-center justify-between gap-4 py-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.dataKey}</span>
                </div>
                <div className="text-right">
                  <span className={`font-medium ${statusColors[status as keyof typeof statusColors]}`}>
                    {entry.value} units
                  </span>
                  <div className="text-xs text-muted-foreground">
                    Optimal: {optimal} | Reorder: {reorder}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="week" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          {showAdvanced && <Legend />}
          
          {/* Forecast lines for each item */}
          {data.map((item, index) => (
            <Line
              key={item.id}
              type="monotone"
              dataKey={item.name}
              stroke={Object.values(chartConfig)[index]?.color || "hsl(var(--primary))"}
              strokeWidth={2}
              dot={{ fill: Object.values(chartConfig)[index]?.color || "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: Object.values(chartConfig)[index]?.color || "hsl(var(--primary))", strokeWidth: 2 }}
            />
          ))}
          
          {/* Reference lines for optimal and reorder points */}
          {showAdvanced && data.map((item, index) => (
            <g key={`ref-${item.id}`}>
              <ReferenceLine 
                y={item.optimalStock} 
                stroke="hsl(var(--success))" 
                strokeDasharray="5 5" 
                label={{ value: `${item.name} Optimal`, position: "top" }}
              />
              <ReferenceLine 
                y={item.reorderPoint} 
                stroke="hsl(var(--warning))" 
                strokeDasharray="3 3" 
                label={{ value: `${item.name} Reorder`, position: "bottom" }}
              />
            </g>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}