import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Smartphone, AlertTriangle, TrendingDown, Package, Send } from "lucide-react";
import { InventoryItem } from "./Dashboard";
import { useToast } from "@/hooks/use-toast";

interface NotificationCenterProps {
  inventory: InventoryItem[];
}

export function NotificationCenter({ inventory }: NotificationCenterProps) {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const { toast } = useToast();

  const criticalItems = inventory.filter(item => item.status === "critical");
  const understockedItems = inventory.filter(item => item.status === "understock");
  const overstockedItems = inventory.filter(item => item.status === "overstock");

  const sendTestNotification = async () => {
    if (!webhookUrl && !emailAddress) {
      toast({
        title: "Configuration Required",
        description: "Please configure either email or webhook URL for notifications",
        variant: "destructive",
      });
      return;
    }

    // For email notifications, you would need Supabase integration
    if (emailAddress && emailEnabled) {
      toast({
        title: "Email Integration Required",
        description: "Connect to Supabase to enable email notifications",
        variant: "destructive",
      });
      return;
    }

    // Send webhook notification if configured
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
          body: JSON.stringify({
            type: "inventory_alert",
            timestamp: new Date().toISOString(),
            critical_items: criticalItems.length,
            understocked_items: understockedItems.length,
            overstocked_items: overstockedItems.length,
            items: criticalItems.concat(understockedItems).map(item => ({
              name: item.name,
              current_stock: item.currentStock,
              optimal_stock: item.optimalStock,
              status: item.status
            }))
          }),
        });

        toast({
          title: "Test Notification Sent",
          description: "Webhook notification has been sent successfully",
        });
      } catch (error) {
        toast({
          title: "Notification Failed",
          description: "Failed to send webhook notification",
          variant: "destructive",
        });
      }
    }
  };

  const notifications = [
    ...criticalItems.map(item => ({
      id: `critical-${item.id}`,
      type: "critical",
      icon: <AlertTriangle className="h-4 w-4" />,
      title: "Critical Stock Alert",
      message: `${item.name} is critically low (${item.currentStock} units)`,
      time: "5 min ago",
      color: "destructive"
    })),
    ...understockedItems.map(item => ({
      id: `understock-${item.id}`,
      type: "warning",
      icon: <TrendingDown className="h-4 w-4" />,
      title: "Understock Warning",
      message: `${item.name} is below optimal levels (${item.currentStock}/${item.optimalStock})`,
      time: "15 min ago",
      color: "warning"
    })),
    ...overstockedItems.map(item => ({
      id: `overstock-${item.id}`,
      type: "info",
      icon: <Package className="h-4 w-4" />,
      title: "Overstock Notice",
      message: `${item.name} is above optimal levels (${item.currentStock}/${item.optimalStock})`,
      time: "1 hour ago",
      color: "info"
    }))
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Alerts
          </CardTitle>
          <CardDescription>
            AI-detected inventory risks and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No alerts at this time</p>
                <p className="text-sm">Your inventory levels are optimal</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-1 rounded-full ${
                    notification.color === "destructive" ? "bg-destructive/10 text-destructive" :
                    notification.color === "warning" ? "bg-warning/10 text-warning" :
                    "bg-info/10 text-info"
                  }`}>
                    {notification.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {notification.time}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure how you receive inventory alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts via email
                </p>
              </div>
              <Switch
                checked={emailEnabled}
                onCheckedChange={setEmailEnabled}
              />
            </div>

            {emailEnabled && (
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your-email@company.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Note: Email notifications require Supabase integration
                </p>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  SMS Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts via SMS
                </p>
              </div>
              <Switch
                checked={smsEnabled}
                onCheckedChange={setSmsEnabled}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="webhook">Webhook URL (Optional)</Label>
              <Input
                id="webhook"
                type="url"
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Integrate with Zapier, Slack, or other services
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Current Status</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-destructive">{criticalItems.length}</div>
                <div className="text-xs text-muted-foreground">Critical</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-warning">{understockedItems.length}</div>
                <div className="text-xs text-muted-foreground">Understock</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-info">{overstockedItems.length}</div>
                <div className="text-xs text-muted-foreground">Overstock</div>
              </div>
            </div>
          </div>

          <Button onClick={sendTestNotification} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Send Test Notification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}