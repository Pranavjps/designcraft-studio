import { useState, useEffect } from "react";
import { User, Bell, Shield, CreditCard, Users, Key, Globe, Palette, Save, Loader2, Upload, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import api, { UserProfile, NotificationPreferences, TeamMember } from "@/lib/api";


// Mock data
const mockProfile: UserProfile = {
  id: "1",
  email: "john@acme.com",
  name: "Pranav",
  avatar_url: "",
  role: "admin",
  tenant: { id: "1", name: "Acme Inc." },
  created_at: "2025-01-01T00:00:00Z"
};

const mockNotifications: NotificationPreferences = {
  email_enabled: true,
  new_conversations: true,
  unread_messages: false,
  weekly_reports: true
};

const mockTeamMembers: TeamMember[] = [
  { id: "1", email: "john@acme.com", name: "Pranav", role: "owner", created_at: "2025-01-01T00:00:00Z", last_active: "2 min ago" },
  { id: "2", email: "jane@acme.com", name: "Jane Smith", role: "admin", created_at: "2025-01-05T00:00:00Z", last_active: "1 hour ago" },
  { id: "3", email: "bob@acme.com", name: "Bob Johnson", role: "user", created_at: "2025-01-12T00:00:00Z", last_active: "1 day ago" },
];

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [notifications, setNotifications] = useState<NotificationPreferences>(mockNotifications);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [isSaving, setIsSaving] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoadingSettings(true);
    try {
      const [profileData, notifData] = await Promise.all([
        api.getUserProfile(),
        api.getNotificationPreferences(),
      ]);
      if (profileData) {
        setProfile(profileData);
        // Load team members after we have the profile
        try {
          const teamData = await api.getTeamMembers();
          const members = teamData.users || teamData.members || [];
          setTeamMembers(members as TeamMember[]);
        } catch {
          // Team members endpoint may not be available
        }
      }
      if (notifData) setNotifications(notifData);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await api.updateUserProfile({ name: profile.name, email: profile.email });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      await api.updateNotificationPreferences(notifications);
      toast.success("Notification preferences saved!");
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords don't match");
      return;
    }
    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      await api.changePassword(passwords.current, passwords.new);
      toast.success("Password changed successfully!");
      setShowChangePassword(false);
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  const handleInviteTeamMember = async () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      await api.inviteTeamMember(profile.tenant.id, inviteEmail, inviteRole);
      toast.success("Invitation sent!");
      setShowInvite(false);
      setInviteEmail("");
    } catch (error) {
      toast.error("Failed to send invitation");
    }
  };

  const handleRemoveTeamMember = async (memberId: string) => {
    try {
      await api.removeTeamMember(memberId);
      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
      toast.success("Team member removed");
    } catch (error) {
      toast.error("Failed to remove team member");
    }
  };

  const handleUpdateRole = async (memberId: string, role: string) => {
    try {
      await api.updateUserRole(memberId, role);
      setTeamMembers(teamMembers.map(m => m.id === memberId ? { ...m, role } : m));
      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (isLoadingSettings) {
    return (
      <div className="h-full bg-accent/20 p-6 overflow-y-auto flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading settings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-accent/20 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Language</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>full_
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input value={profile.tenant.name} disabled />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input value={profile.role} disabled />
                  </div>
                </div>

                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">Profile data unavailable.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email_enabled}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email_enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">New Conversations</p>
                    <p className="text-sm text-muted-foreground">Get notified when a new conversation starts</p>
                  </div>
                  <Switch
                    checked={notifications.new_conversations}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, new_conversations: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Unread Messages</p>
                    <p className="text-sm text-muted-foreground">Get notified about unread messages</p>
                  </div>
                  <Switch
                    checked={notifications.unread_messages}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, unread_messages: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Weekly Reports</p>
                    <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
                  </div>
                  <Switch
                    checked={notifications.weekly_reports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weekly_reports: checked })}
                  />
                </div>

                <Button onClick={handleSaveNotifications} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Password</p>
                    <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                  </div>
                  <Button variant="outline" onClick={() => setShowChangePassword(true)}>
                    Change Password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Active Sessions</p>
                    <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                  </div>
                  <Button variant="outline">View Sessions</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your team</CardDescription>
                </div>
                <Button onClick={() => setShowInvite(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No team members found.</p>
                  ) : (
                    teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                            {member.role}
                          </Badge>
                          {member.last_active && (
                            <span className="text-sm text-muted-foreground">{member.last_active}</span>
                          )}
                          {profile && member.id !== profile.id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleRemoveTeamMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>Manage your subscription and billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border border-border rounded-lg bg-primary/5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-lg font-semibold text-foreground">Pro Plan</p>
                      <p className="text-sm text-muted-foreground">50,000 credits/month</p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline">Change Plan</Button>
                    <Button variant="outline">View Invoices</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Usage This Month</h3>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "45%" }} />
                  </div>
                  <p className="text-sm text-muted-foreground">22,500 / 50,000 credits used</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage your API keys for integrations</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Key
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Production API Key</p>
                      <p className="text-sm text-muted-foreground font-mono">sk_live_****1234</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Active</Badge>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Language Tab */}
          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>Set your preferred language</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Save Language</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the app looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Save Theme</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Change Password Dialog */}
        <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowChangePassword(false)}>Cancel</Button>
              <Button onClick={handleChangePassword}>Change Password</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Invite Member Dialog */}
        <Dialog open={showInvite} onOpenChange={setShowInvite}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
              <Button onClick={handleInviteTeamMember}>Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}