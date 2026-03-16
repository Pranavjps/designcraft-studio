import { useState, useEffect } from "react";
import { MessageCircle, ShoppingBag, Zap, Mail, CreditCard, Database, Check, Settings, Loader2, ExternalLink, RefreshCw, Calendar, Sheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api, { Integration } from "@/lib/api";


// No mock data - all integrations come from the backend
const integrationIcons: Record<string, any> = {
  whatsapp: MessageCircle,
  shopify: ShoppingBag,
  google_calendar: Calendar,
  google_sheets: Sheet,
  zapier: Zap,
  stripe: CreditCard,
  mailchimp: Mail,
  hubspot: Database,
};

export default function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectDialog, setConnectDialog] = useState<Integration | null>(null);
  const [connectionConfig, setConnectionConfig] = useState<Record<string, string>>({});
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check for OAuth callback status in URL
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const integration = urlParams.get('integration');
    const error = urlParams.get('error');

    if (status === 'success' && integration) {
      toast.success(`${integration.replace('_', ' ')} connected successfully! 🎉`);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (status === 'error') {
      toast.error(error || 'Connection failed. Please try again.');
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setIsLoading(true);
    try {
      const data = await api.getIntegrations();
      if (data.integrations) {
        setIntegrations(data.integrations);
      }
    } catch (error) {
      console.error("Failed to load integrations", error);
      // Show empty state - do not use mock data
      setIntegrations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (integration: Integration) => {
    // Toggle is done by connect/disconnect
    if (integration.status === 'connected') {
      await handleDisconnect(integration);
    } else {
      setConnectDialog(integration);
    }
  };

  const handleConnect = async () => {
    if (!connectDialog) return;

    setIsConnecting(true);
    try {
      // All integrations use OAuth flow
      const metadata = connectDialog.type === 'shopify' ? connectionConfig : undefined;
      const response = await api.initiateOAuthConnection(connectDialog.type, metadata);
      // Redirect to OAuth provider
      window.location.href = response.redirect_url;
      // After OAuth, user will be redirected back with status params
    } catch (error: any) {
      toast.error(error?.message || "Failed to initiate connection");
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (integration: Integration) => {
    if (!integration.type) return;

    try {
      await api.disconnectIntegration(integration.type);
      toast.success(`${integration.name} disconnected`);
      loadIntegrations();
    } catch (error: any) {
      toast.error(error?.message || "Failed to disconnect integration");
    }
  };

  const handleTest = async (integration: Integration) => {
    // Test connection by refreshing integration status
    toast.info("Refreshing integration status…");
    loadIntegrations();
  };

  const getConnectionFields = (type: string) => {
    switch (type) {
      case "google_calendar":
      case "google_sheets":
        // OAuth integrations - no fields needed, will redirect to Google
        return [];
      case "shopify":
        return [
          { key: "shop_url", label: "Shop URL", placeholder: "your-store.myshopify.com" }
        ];
      case "stripe":
        return [
          { key: "api_key", label: "API Key", placeholder: "sk_live_xxxxxxxxxxxxx", type: "password" }
        ];
      case "mailchimp":
        return [
          { key: "api_key", label: "API Key", placeholder: "xxxxxxxxxxxxxxx-us1", type: "password" }
        ];
      case "hubspot":
        return [
          { key: "api_key", label: "API Key", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", type: "password" }
        ];
      case "zapier":
        return [
          { key: "webhook_url", label: "Webhook URL", placeholder: "https://hooks.zapier.com/..." }
        ];
      default:
        return [];
    }
  };

  const connectedIntegrations = integrations.filter(i => i.status === "connected");
  const availableIntegrations = integrations.filter(i => i.status === "available");

  return (
    <div className="h-full bg-accent/20 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground">Connect your favorite tools to enhance your chatbot</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Connected Integrations */}
            {connectedIntegrations.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-4">Connected</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connectedIntegrations.map((integration) => {
                    const Icon = integrationIcons[integration.type] || Zap;
                    return (
                      <Card key={integration.id || integration.type} className="relative">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Icon className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{integration.name}</CardTitle>
                                <Badge variant="outline" className="text-green-600 bg-green-50 mt-1">
                                  <Check className="h-3 w-3 mr-1" />
                                  Connected
                                </Badge>
                              </div>
                            </div>
                            <Switch
                              checked={integration.enabled}
                              onCheckedChange={() => handleToggle(integration)}
                            />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                          {integration.config && (
                            <p className="text-xs text-muted-foreground mb-4">
                              {integration.config.phone_number || integration.config.shop_url}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleTest(integration)}>
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Test
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-3 w-3 mr-1" />
                              Configure
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDisconnect(integration)}
                            >
                              Disconnect
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Integrations */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Available Integrations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableIntegrations.map((integration) => {
                  const Icon = integrationIcons[integration.type] || Zap;
                  return (
                    <Card key={integration.type} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-accent rounded-lg">
                            <Icon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{integration.name}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                        <Button
                          className="w-full"
                          onClick={() => setConnectDialog(integration)}
                        >
                          Connect
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Connect Dialog */}
        <Dialog open={!!connectDialog} onOpenChange={() => setConnectDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect {connectDialog?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {connectDialog && (() => {
                const fields = getConnectionFields(connectDialog.type);
                const isOAuth = ['google_calendar', 'google_sheets', 'shopify'].includes(connectDialog.type);

                return (
                  <>
                    {isOAuth && fields.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        You'll be redirected to {connectDialog.type.includes('google') ? 'Google' : 'Shopify'} to authorize access.
                      </p>
                    )}
                    {fields.map((field) => (
                      <div key={field.key}>
                        <Label>{field.label}</Label>
                        <Input
                          type={'type' in field ? field.type : "text"}
                          placeholder={field.placeholder}
                          value={connectionConfig[field.key] || ""}
                          onChange={(e) => setConnectionConfig({
                            ...connectionConfig,
                            [field.key]: e.target.value
                          })}
                        />
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConnectDialog(null)}>
                Cancel
              </Button>
              <Button onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}