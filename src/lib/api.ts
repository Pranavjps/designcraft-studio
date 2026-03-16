// API Client Configuration
const API_BASE_URL = '/api';
const AUTH_BASE_URL = '/api';
const AI_BASE_URL = '/api';

console.log('[API] Using proxy URLs for development');

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  tenant_id: string;
  avatar_url?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface DashboardOverview {
  total_conversations: { value: number; change: number; trend: 'up' | 'down' };
  active_users: { value: number; change: number; trend: 'up' | 'down' };
  response_rate: { value: number; change: number; trend: 'up' | 'down' };
  avg_response_time: { value: string; change: number; trend: 'up' | 'down' };
}

export interface ChartDataPoint {
  date: string;
  sent: number;
  bounced: number;
}

export interface CreditBalance {
  email_credits: number;
  pricing: {
    smtp_api: number;
    campaigns: number;
    verifications: number;
  };
}

export interface SendingLimits {
  emails_per_second: number;
  emails_per_day: number;
  sent_today: number;
  remaining: number;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  initials?: string;
  attributes?: Record<string, string>;
  message_count?: number;
  created_at?: string;
  last_seen_at?: string;
  email?: string;
  location?: string;
  tags?: string[];
  last_active?: string;
  is_online?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  phone: string;
  last_seen_at: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

export interface Message {
  id: string;
  direction: 'inbound' | 'outbound';
  body: string;
  created_at: string;
  status: string;
  role: 'user' | 'assistant';
}

export interface ConversationMessages {
  messages: Message[];
  contact: Contact;
  stats: {
    total_messages: number;
    total_conversations: number;
    first_contact: string;
    last_active: string;
  };
}

export interface AnalyticsOverview {
  total_messages: number;
  total_conversations: number;
  inbound_messages: number;
  outbound_messages: number;
  average_response_time_seconds: number;
  conversation_growth_percent: number;
  // B2C CRM Metrics
  total_customers?: number;
  active_customers?: number;
  churned_customers?: number;
  total_revenue?: number; // in paise
  total_orders?: number;
}

export interface ConversationTrend {
  date: string;
  conversations: number;
  users: number;
}

export interface DeviceBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface TopicDistribution {
  name: string;
  percentage: number;
}

export interface PerformanceData {
  resolution_rate: number;
  customer_satisfaction: number;
  comparison: {
    metrics: Array<{
      name: string;
      bot: string;
      agent: string;
      winner: 'bot' | 'agent';
      comparison: string;
    }>;
  };
}

export interface Document {
  id: string;
  filename: string;
  content_type?: string;
  status: "ready" | "processing" | "failed";
  uploaded_at: string;
  doc_metadata?: Record<string, any> | null;
}

export interface Integration {
  id: string | null;
  type: string;
  name: string;
  description: string;
  status: 'connected' | 'available';
  enabled: boolean;
  config: Record<string, string> | null;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  status: string;
  created_at: string;
  notification_settings: {
    email_enabled: boolean;
    new_conversations: boolean;
    unread_messages: boolean;
    weekly_reports: boolean;
  };
}

export interface NotificationPreferences {
  email_enabled: boolean;
  new_conversations: boolean;
  unread_messages: boolean;
  weekly_reports: boolean;
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  last_active: string;
}

class APIClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('access_token');

    if (import.meta.env.DEV) {
      console.info('[API] AUTH_BASE_URL:', AUTH_BASE_URL);
      console.info('[API] API_BASE_URL:', API_BASE_URL);
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'omit', // Fix CORS issues with preview domains
    });

    if (response.status === 401 && this.token) {
      // Token is expired, clear it and throw error
      this.clearToken();
      throw new Error('Authentication expired');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  private async requestFormData<T>(url: string, formData: FormData): Promise<T> {
    const headers: HeadersInit = {};

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'omit', // Fix CORS issues with preview domains
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // ==================== AUTH APIs ====================

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      const message = error?.detail || error?.error?.message || error?.message || 'Login failed';
      throw new Error(`Login failed (${response.status}): ${message}`);
    }

    const data = await response.json();

    // ✅ STORE TOKENS
    this.setToken(data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);

    return data;
  }

  async register(data: {
    email: string;
    password: string;
    full_name: string;
    tenant_name: string;
  }): Promise<{ user_id: string }> {
    const response = await this.request<{ user_id: string }>(`${AUTH_BASE_URL}/v1/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        tenant_name: data.tenant_name,
      }),
    });

    return response;
  }

  async verifyToken(token: string): Promise<{
    user_id: string;
    tenant_id: string;
    email: string;
    role: string;
    scopes: string[];
  }> {
    return this.request(`${AUTH_BASE_URL}/v1/auth/verify`, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async refreshToken(): Promise<AuthResponse> {
    throw new Error('Token refresh not supported by this API');
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request(`${AUTH_BASE_URL}/v1/auth/forgot-password`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return this.request(`${AUTH_BASE_URL}/v1/auth/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    });
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    return this.request(`${AUTH_BASE_URL}/v1/auth/verify-email`, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  logout() {
    this.clearToken();
  }

  // ==================== DASHBOARD APIs ====================

  async getDashboardOverview(): Promise<AnalyticsOverview> {
    return this.request(`${API_BASE_URL}/v1/analytics/overview`);
  }

  async getChartData(period: string = '7d'): Promise<{ daily_volume: ChartDataPoint[] }> {
    return this.request(`${API_BASE_URL}/v1/analytics/chart-data?period=${period}`);
  }

  async getCreditBalance(): Promise<CreditBalance> {
    return this.request(`${API_BASE_URL}/v1/billing/credits`);
  }

  async getRecentCampaigns(limit: number = 5): Promise<{ campaigns: any[]; total: number }> {
    return this.request(`${API_BASE_URL}/v1/campaigns?limit=${limit}&recent=true`);
  }

  async getRecentEmails(limit: number = 5): Promise<{ emails: any[]; total: number }> {
    return this.request(`${API_BASE_URL}/v1/messages/recent?limit=${limit}`);
  }

  async getSendingLimits(): Promise<SendingLimits> {
    return this.request(`${API_BASE_URL}/v1/workspace/limits`);
  }

  async topUpCredits(amount: number): Promise<{ success: boolean; message: string }> {
    return this.request(`${API_BASE_URL}/v1/billing/topup`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // ==================== CONVERSATIONS APIs ====================

  async getConversations(filters: {
    search?: string;
    filter?: 'all' | 'unread' | 'archived';
    page?: number;
    limit?: number;
  } = {}): Promise<{ conversations: Conversation[]; total: number; page: number; per_page: number }> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.limit) params.set('per_page', filters.limit.toString());
    return this.request(`${API_BASE_URL}/v1/conversations?${params}`);
  }

  async getConversationDetail(contactId: string): Promise<ConversationMessages> {
    return this.request(`${API_BASE_URL}/v1/conversations/${contactId}`);
  }

  async getMessages(contactId: string, limit: number = 50): Promise<ConversationMessages> {
    return this.request(`${API_BASE_URL}/v1/conversations/${contactId}/messages?limit=${limit}`);
  }

  async sendMessage(contactId: string, body: string): Promise<Message> {
    return this.request(`${API_BASE_URL}/v1/conversations/${contactId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    });
  }

  async archiveConversation(contactId: string) {
    return this.request(`${API_BASE_URL}/v1/conversations/${contactId}/archive`, {
      method: 'PATCH',
    });
  }


  async exportConversation(contactId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/v1/conversations/${contactId}/export`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response.blob();
  }

  async blockContact(contactId: string): Promise<{ success: boolean }> {
    return this.request(`${API_BASE_URL}/v1/conversations/${contactId}`, {
      method: 'DELETE',
    });
  }

  // ==================== CONTACTS APIs ====================

  async getContacts(filters: {
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    contacts: Contact[];
    total: number;
    page: number;
    per_page: number;
  }> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.limit) params.set('per_page', filters.limit.toString());

    return this.request(`${API_BASE_URL}/v1/contacts?${params}`);
  }

  async createContact(data: {
    name: string;
    email: string;
    phone: string;
    tags?: string[];
  }): Promise<Contact> {
    return this.request(`${API_BASE_URL}/v1/contacts`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContact(contactId: string, data: Partial<Contact>): Promise<Contact> {
    return this.request(`${API_BASE_URL}/v1/contacts/${contactId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteContact(contactId: string): Promise<{ success: boolean }> {
    return this.request(`${API_BASE_URL}/v1/contacts/${contactId}`, {
      method: 'DELETE',
    });
  }

  async importContacts(file: File): Promise<{ imported: number; failed: number; errors: any[] }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.requestFormData(`${API_BASE_URL}/v1/contacts/import`, formData);
  }

  async exportContacts(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/v1/contacts/export`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response.blob();
  }

  // ==================== ANALYTICS APIs ====================

  async getAnalyticsOverview(period: string = '30d'): Promise<AnalyticsOverview> {
    return this.request(`${API_BASE_URL}/v1/analytics/overview?period=${period}`);
  }

  async getConversationTrends(period: string = '7d'): Promise<{ conversation_trends: ConversationTrend[] }> {
    return this.request(`${API_BASE_URL}/v1/analytics/trends?period=${period}`);
  }

  async getDeviceBreakdown(): Promise<{ devices: DeviceBreakdown[] }> {
    return this.request(`${API_BASE_URL}/v1/analytics/devices`);
  }

  async getTopicDistribution(): Promise<{ topics: TopicDistribution[] }> {
    return this.request(`${API_BASE_URL}/v1/analytics/topics`);
  }

  async getResponseTimeBreakdown(): Promise<{ breakdown: Array<{ range: string; count: number }> }> {
    return this.request(`${API_BASE_URL}/v1/analytics/response-time-breakdown`);
  }

  async getPerformanceData(): Promise<PerformanceData> {
    return this.request(`${API_BASE_URL}/v1/analytics/performance`);
  }

  // ==================== KNOWLEDGE BASE APIs ====================

  async getDocuments(view: 'grid' | 'list' = 'grid', status: string = 'all'): Promise<{
    documents: Document[];
    processing_count: number;
    total: number;
  }> {
    return this.request(`${API_BASE_URL}/v1/kb/documents?view=${view}&status=${status}`);
  }

  async uploadDocument(file: File): Promise<{ id: string; filename: string; status: string; message: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.requestFormData(`${API_BASE_URL}/v1/kb/documents`, formData);
  }

  async deleteDocument(documentId: string): Promise<{ success: boolean }> {
    return this.request(`${API_BASE_URL}/v1/kb/documents/${documentId}`, {
      method: 'DELETE',
    });
  }

  async downloadDocument(documentId: string) {
    const res = await fetch(
      `${API_BASE_URL}/v1/kb/documents/${documentId}/download`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );

    const contentType = res.headers.get('content-type') || '';

    // Case 1: JSON response with presigned URL
    if (contentType.includes('application/json')) {
      const data = await res.json();

      if (data.download_url) {
        window.open(data.download_url, '_blank');
        return;
      }

      throw new Error('Invalid download response');
    }

    // Case 2: Binary stream
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    // Try to extract filename from headers
    const disposition = res.headers.get('content-disposition');
    let filename = 'download';

    if (disposition) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match) filename = match[1];
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }


  async addTextSnippet(title: string, content: string) {
    return this.request(`${API_BASE_URL}/v1/kb/text`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        text: content,   // ✅ FIX
      }),
    });
  }


  // ==================== INTEGRATIONS APIs ====================

  async getIntegrations(): Promise<{ integrations: Integration[] }> {
    return this.request(`${AI_BASE_URL}/v1/connectors`);
  }

  async connectIntegration(type: string, config: Record<string, string>): Promise<Integration> {
    return this.request(`${AI_BASE_URL}/v1/connectors`, {
      method: 'POST',
      body: JSON.stringify({ type, config }),
    });
  }

  async testIntegration(connectorId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`${AI_BASE_URL}/v1/connectors/${connectorId}/test`, {
      method: 'POST',
    });
  }

  async toggleIntegration(connectorId: string, enabled: boolean): Promise<Integration> {
    return this.request(`${AI_BASE_URL}/v1/connectors/${connectorId}`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    });
  }

  async configureIntegration(connectorId: string, config: Record<string, string>): Promise<Integration> {
    return this.request(`${AI_BASE_URL}/v1/connectors/${connectorId}`, {
      method: 'PATCH',
      body: JSON.stringify({ config }),
    });
  }

  async disconnectIntegration(connectorId: string): Promise<{ success: boolean }> {
    return this.request(`${AI_BASE_URL}/v1/connectors/${connectorId}`, {
      method: 'DELETE',
    });
  }

  // ==================== SETTINGS APIs ====================

  // Profile
  async getUserProfile(): Promise<UserProfile> {
    return this.request(`${AUTH_BASE_URL}/v1/users/me`);
  }

  async updateUserProfile(data: Partial<UserProfile>): Promise<{ success: boolean; message: string }> {
    return this.request(`${AUTH_BASE_URL}/v1/users/me/profile?full_name=${data.full_name}`, {
      method: 'PATCH',
    });
  }

  async uploadAvatar(file: File): Promise<{ success: boolean; avatar_url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.requestFormData(`${AUTH_BASE_URL}/v1/users/me/avatar`, formData);
  }

  // Notifications
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    return this.request(`${AUTH_BASE_URL}/v1/users/me/notifications`);
  }

  async updateNotificationPreferences(data: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    return this.request(`${AUTH_BASE_URL}/v1/users/me/notifications`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Security
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return this.request(`${AUTH_BASE_URL}/v1/users/me/change-password?current_password=${encodeURIComponent(currentPassword)}&new_password=${encodeURIComponent(newPassword)}`, {
      method: 'POST',
    });
  }

  async deleteAccount(password: string): Promise<{ success: boolean; message: string }> {
    return this.request(`${AUTH_BASE_URL}/v1/users/me?password=${encodeURIComponent(password)}`, {
      method: 'DELETE',
    });
  }

  // Billing
  async getSubscription(): Promise<{
    current_plan: {
      id: string;
      name: string;
      monthly_credits: number;
      price_inr: number;
      max_users: number;
    };
    current_period_start: string;
    current_period_end: string;
    status: string;
  }> {
    return this.request(`${API_BASE_URL}/v1/billing/subscriptions`);
  }

  async getUsageHistory(period: string = '30d'): Promise<{
    usage: Array<{
      date: string;
      input_tokens: number;
      output_tokens: number;
      credits_used: number;
    }>;
    total_credits_used: number;
    period: string;
  }> {
    return this.request(`${API_BASE_URL}/v1/billing/usage?period=${period}`);
  }

  async upgradePlan(planId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`${API_BASE_URL}/v1/billing/subscriptions/${planId}/upgrade`, {
      method: 'POST',
    });
  }

  // Team
  async getTeamMembers(tenantId: string): Promise<{ users: TeamMember[]; total: number }> {
    return this.request(`${AUTH_BASE_URL}/v1/users/${tenantId}`);
  }

  async inviteTeamMember(tenantId: string, email: string, role: string): Promise<{ success: boolean; message: string; invitation_id: string }> {
    return this.request(`${AUTH_BASE_URL}/v1/users/${tenantId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  }

  async removeTeamMember(userId: string): Promise<{ success: boolean }> {
    return this.request(`${AUTH_BASE_URL}/v1/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async updateUserRole(userId: string, role: string): Promise<{ success: boolean }> {
    return this.request(`${AUTH_BASE_URL}/v1/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  // API Keys
  async getApiKeys(): Promise<{
    api_keys: Array<{
      id: string;
      name: string;
      key_preview: string;
      scopes: string[];
      created_at: string;
      last_used_at: string;
      revoked: boolean;
    }>
  }> {
    return this.request(`${AUTH_BASE_URL}/v1/api-keys`);
  }

  async createApiKey(name: string, scopes: string[]): Promise<{
    id: string;
    name: string;
    api_key: string;
    message: string;
  }> {
    return this.request(`${AUTH_BASE_URL}/v1/api-keys`, {
      method: 'POST',
      body: JSON.stringify({ name, scopes }),
    });
  }

  async revokeApiKey(keyId: string): Promise<{ success: boolean }> {
    return this.request(`${AUTH_BASE_URL}/v1/api-keys/${keyId}`, {
      method: 'DELETE',
    });
  }

  // Language & Appearance
  async getLanguages(): Promise<{ languages: Array<{ code: string; name: string; native_name: string }> }> {
    return this.request(`${API_BASE_URL}/v1/workspace/languages`);
  }

  async getUserPreferences(): Promise<{ theme: string; compact_mode: boolean; sidebar_position: string }> {
    return this.request(`${AUTH_BASE_URL}/v1/users/me/preferences`);
  }

  async updateUserPreferences(data: { theme?: string; compact_mode?: boolean; language?: string }): Promise<any> {
    return this.request(`${AUTH_BASE_URL}/v1/users/me/preferences`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const api = new APIClient();
export default api;
