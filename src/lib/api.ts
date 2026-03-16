// API Client Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:8000';
const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL || 'http://localhost:8002';

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

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  lead_source: string;
  lead_status: string;
  lead_score: number;
  buying_intent_keywords: string[];
  interested_in_products: string[];
  city: string;
  notes?: string;
  created_at?: string;
  budget_range?: string;
  lead_owner?: string;
  utm_campaign?: string;
  referral_code?: string;
  state?: string;
  converted?: boolean;
  updated_at?: string;
  last_contacted_at?: string;
  tenant_id?: string;
}

export interface Customer {
  id: string;
  tenant_id: string;
  customer_name: string;
  phone: string;
  email: string;
  customer_source: string;
  customer_status: string;
  tags: Array<string>;
  city: string;
  state?: string;
  country?: string;
  pincode?: string;
  preferred_language?: string;
  total_orders: number;
  total_revenue: number;
  average_order_value?: number;
  message_frequency?: number;
  buying_intent_score?: number;
  churn_risk: "Low" | "Medium" | "High";
  last_contacted_at?: string;
  created_at?: string;
  updated_at?: string;
  notes?: string;
  customer_owner?: string;
  whatsapp_contact_id?: string;
  days_since_last_order?: number;
}

export interface Deal {
  id: string;
  deal_name: string;
  customer_id: string;
  amount: number;
  final_amount?: number;
  stage: string;
  probability: number;
  expected_close_date: string;
  product_names: string[];
  created_at?: string;
  updated_at?: string;
  tenant_id?: string;
  discount_applied?: number;
  last_agent_interaction?: string;
  next_step?: string;
  notes?: string;
  deal_owner?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  deal_id?: string;
  product_names: string[];
  quantity: number;
  subtotal?: number;
  discount?: number;
  shipping_charges?: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  tracking_number?: string;
  courier_name?: string;
  has_issue?: boolean;
  issue_type?: string;
  notes?: string;
  created_at?: string;
  ordered_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  tenant_id?: string;
}

export interface Task {
  id: string;
  subject: string;
  priority: string;
  due_date: string;
  assigned_to_agent: string;
  notes?: string;
  status?: string;
  created_at?: string;
  customer_id?: string;
  deal_id?: string;
  order_id?: string;
  lead_id?: string;
  auto_created?: boolean;
  updated_at?: string;
  tenant_id?: string;
}

export interface Campaign {
  id: string;
  campaign_name: string;
  campaign_type: string;
  status: string;
  message_template: string;
  total_sent: number;
  total_delivered: number;
  total_replied: number;
  total_conversions: number;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  tenant_id: string;
  updated_at: string;
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
  connected_at?: string;
  scopes?: string[];
  actions?: {
    can_connect: boolean;
    can_disconnect: boolean;
    can_reconnect: boolean;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  tenant: { id: string; name: string };
  created_at: string;
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

// Helper to redirect to login on 401
function handleUnauthorized() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
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
      credentials: 'omit',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || error.detail || `HTTP ${response.status}: ${response.statusText}`);
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
      credentials: 'omit',
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized - redirecting to login');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // ==================== AUTH APIs ====================

  async login(email: string, password: string): Promise<AuthResponse> {
    const url = `${AUTH_BASE_URL}/v1/auth/login`;
    console.log('[API] Login URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    console.log('[API] Login response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error?.message || 'Login failed');
    }

    const data = await response.json();
    console.log('[API] Login success data:', data);

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

  async getDashboardOverview(): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/dashboard/stats?time_period=month`);
  }

  async getDashboardStats(timePeriod: string = 'month', agent?: string): Promise<any> {
    const params = new URLSearchParams({ time_period: timePeriod });
    if (agent) params.set('agent', agent);
    return this.request(`${AI_BASE_URL}/v1/dashboard/stats?${params}`);
  }

  async getAgentStats(): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/dashboard/agent-stats`);
  }

  async getChartData(period: string = '7d'): Promise<{ daily_volume: ChartDataPoint[] }> {
    return this.request(`${AI_BASE_URL}/v1/analytics/chart-data?period=${period}`);
  }

  async getCreditBalance(): Promise<CreditBalance> {
    return this.request(`${AI_BASE_URL}/v1/billing/credits`);
  }

  async getRecentCampaigns(limit: number = 5): Promise<{ campaigns: any[]; total: number }> {
    return this.request(`${AI_BASE_URL}/v1/campaigns?limit=${limit}`);
  }

  async getRecentEmails(limit: number = 5): Promise<{ emails: any[]; total: number }> {
    return this.request(`${AI_BASE_URL}/v1/messages/recent?limit=${limit}`);
  }

  async getSendingLimits(): Promise<SendingLimits> {
    return this.request(`${AI_BASE_URL}/v1/workspace/limits`);
  }

  async topUpCredits(amount: number): Promise<{ success: boolean; new_balance: number; transaction_id: string }> {
    return this.request(`${AI_BASE_URL}/v1/billing/credits/topup?amount=${amount}`, {
      method: 'POST',
    });
  }

  async getBillingHistory(page: number = 1, perPage: number = 20): Promise<{ transactions: any[]; total: number }> {
    return this.request(`${AI_BASE_URL}/v1/billing/history?page=${page}&per_page=${perPage}`);
  }

  async getCreditUsage(startDate?: string, endDate?: string): Promise<any> {
    const params = new URLSearchParams();
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);
    return this.request(`${AI_BASE_URL}/v1/billing/usage?${params}`);
  }

  async getInvoices(): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/billing/invoices`);
  }

  async getBillingSubscription(): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/billing/subscription`);
  }

  // ==================== WORKSPACE APIs ====================

  async getWorkspaceMembers(page: number = 1, perPage: number = 20): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/workspace/members?page=${page}&per_page=${perPage}`);
  }

  async getWorkspaceInfo(): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/workspace/info`);
  }

  async removeWorkspaceMember(memberId: string): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/workspace/members/${memberId}/remove`, {
      method: 'POST',
    });
  }

  async updateWorkspaceMemberRole(memberId: string, role: string): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/workspace/members/${memberId}/role?role=${role}`, {
      method: 'PATCH',
    });
  }

  // ==================== MESSAGES APIs ====================

  async getMessageDetails(messageId: string): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/messages/${messageId}`);
  }

  async deleteMessage(messageId: string): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/messages/${messageId}`, { method: 'DELETE' });
  }

  async listMessages(contactId?: string, page: number = 1, perPage: number = 20): Promise<any> {
    const params = new URLSearchParams({ page: page.toString(), per_page: perPage.toString() });
    if (contactId) params.set('contact_id', contactId);
    return this.request(`${AI_BASE_URL}/v1/messages?${params}`);
  }

  async resendMessage(messageId: string): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/messages/${messageId}/resend`, { method: 'POST' });
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
    return this.request(`${AI_BASE_URL}/v1/conversations/?${params}`);
  }

  async getConversationDetail(contactId: string): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/conversations/${contactId}`);
  }

  async getMessages(contactId: string, limit: number = 50, offset: number = 0): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/conversations/${contactId}/messages?limit=${limit}&offset=${offset}`);
  }

  async sendMessage(contactId: string, body: string): Promise<Message> {
    return this.request(`${AI_BASE_URL}/v1/conversations/${contactId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    });
  }

  async archiveConversation(contactId: string) {
    return this.request(`${AI_BASE_URL}/v1/conversations/${contactId}/archive`, {
      method: 'PATCH',
    });
  }

  async exportConversation(contactId: string): Promise<Blob> {
    const response = await fetch(`${AI_BASE_URL}/v1/conversations/${contactId}/export`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }
    return response.blob();
  }

  async blockContact(contactId: string): Promise<{ status: string }> {
    return this.request(`${AI_BASE_URL}/v1/conversations/${contactId}`, {
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

    return this.request(`${AI_BASE_URL}/v1/contacts?${params}`);
  }

  async getContact(contactId: string): Promise<Contact> {
    return this.request(`${AI_BASE_URL}/v1/contacts/${contactId}`);
  }

  async createContact(data: {
    name: string;
    email: string;
    phone: string;
    tags?: string[];
  }): Promise<Contact> {
    return this.request(`${AI_BASE_URL}/v1/contacts`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContact(contactId: string, data: Partial<Contact>): Promise<Contact> {
    return this.request(`${AI_BASE_URL}/v1/contacts/${contactId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteContact(contactId: string): Promise<{ status: string }> {
    return this.request(`${AI_BASE_URL}/v1/contacts/${contactId}`, {
      method: 'DELETE',
    });
  }

  async importContacts(data: any): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/contacts/import`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async exportContacts(): Promise<Blob> {
    const response = await fetch(`${AI_BASE_URL}/v1/contacts/export`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }
    return response.blob();
  }

  // ==================== LEADS APIs ====================

  async getLeads(filters: {
    page?: number;
    limit?: number;
    search?: string;
    source?: string;
    status?: string;
    min_score?: number;
  } = {}): Promise<{ leads: Lead[]; total: number; items?: Lead[] }> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.limit) params.set('limit', filters.limit.toString());
    if (filters.search) params.set('search', filters.search);
    if (filters.source) params.set('source', filters.source);
    if (filters.status) params.set('status', filters.status);
    if (filters.min_score !== undefined) params.set('min_score', filters.min_score.toString());
    const response = await this.request<any>(`${AI_BASE_URL}/v1/leads?${params}`);
    // Handle various response shapes
    const leads = response.leads || response.items || response.data || (Array.isArray(response) ? response : []);
    return { leads, total: response.total || leads.length };
  }

  async getLead(leadId: string): Promise<Lead> {
    return this.request(`${AI_BASE_URL}/v1/leads/${leadId}`);
  }

  async createLead(data: Partial<Lead>): Promise<Lead> {
    return this.request(`${AI_BASE_URL}/v1/leads`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLead(leadId: string, data: Partial<Lead>): Promise<Lead> {
    return this.request(`${AI_BASE_URL}/v1/leads/${leadId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteLead(leadId: string): Promise<{ status: string }> {
    return this.request(`${AI_BASE_URL}/v1/leads/${leadId}`, { method: 'DELETE' });
  }

  // ==================== CUSTOMERS APIs ====================

  async getCustomers(filters: {
    page?: number;
    limit?: number;
    search?: string;
    source?: string;
    status?: string;
    churn_risk?: string;
    min_orders?: number;
    min_revenue?: number;
    city?: string;
  } = {}): Promise<{ customers: Customer[]; total: number }> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.limit) params.set('limit', filters.limit.toString());
    if (filters.search) params.set('search', filters.search);
    if (filters.source) params.set('source', filters.source);
    if (filters.status) params.set('status', filters.status);
    if (filters.churn_risk) params.set('churn_risk', filters.churn_risk);
    if (filters.min_orders !== undefined) params.set('min_orders', filters.min_orders.toString());
    if (filters.min_revenue !== undefined) params.set('min_revenue', filters.min_revenue.toString());
    if (filters.city) params.set('city', filters.city);
    const response = await this.request<any>(`${AI_BASE_URL}/v1/customers?${params}`);
    const customers = response.customers || response.items || response.data || (Array.isArray(response) ? response : []);
    return { customers, total: response.total || customers.length };
  }

  async getCustomer(customerId: string): Promise<Customer> {
    return this.request(`${AI_BASE_URL}/v1/customers/${customerId}`);
  }

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    return this.request(`${AI_BASE_URL}/v1/customers`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(customerId: string, data: Partial<Customer>): Promise<Customer> {
    return this.request(`${AI_BASE_URL}/v1/customers/${customerId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCustomer(customerId: string): Promise<{ status: string }> {
    return this.request(`${AI_BASE_URL}/v1/customers/${customerId}`, { method: 'DELETE' });
  }

  // ==================== DEALS APIs ====================

  async getDeals(filters: {
    page?: number;
    limit?: number;
    search?: string;
    stage?: string;
    last_agent?: string;
    min_amount?: number;
  } = {}): Promise<{ deals: Deal[]; total: number }> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.limit) params.set('limit', filters.limit.toString());
    if (filters.search) params.set('search', filters.search);
    if (filters.stage) params.set('stage', filters.stage);
    if (filters.last_agent) params.set('last_agent', filters.last_agent);
    if (filters.min_amount !== undefined) params.set('min_amount', filters.min_amount.toString());
    const response = await this.request<any>(`${AI_BASE_URL}/v1/deals?${params}`);
    const deals = response.deals || response.items || response.data || (Array.isArray(response) ? response : []);
    return { deals, total: response.total || deals.length };
  }

  async getDeal(dealId: string): Promise<Deal> {
    return this.request(`${AI_BASE_URL}/v1/deals/${dealId}`);
  }

  async createDeal(data: Partial<Deal>): Promise<Deal> {
    return this.request(`${AI_BASE_URL}/v1/deals`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDeal(dealId: string, data: Partial<Deal>): Promise<Deal> {
    return this.request(`${AI_BASE_URL}/v1/deals/${dealId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteDeal(dealId: string): Promise<{ status: string }> {
    return this.request(`${AI_BASE_URL}/v1/deals/${dealId}`, { method: 'DELETE' });
  }

  // ==================== ORDERS APIs ====================

  async getOrders(filters: {
    page?: number;
    limit?: number;
    search?: string;
    payment_status?: string;
    order_status?: string;
    min_amount?: number;
    has_issue?: boolean;
  } = {}): Promise<{ orders: Order[]; total: number }> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.limit) params.set('limit', filters.limit.toString());
    if (filters.search) params.set('search', filters.search);
    if (filters.payment_status) params.set('payment_status', filters.payment_status);
    if (filters.order_status) params.set('order_status', filters.order_status);
    if (filters.min_amount !== undefined) params.set('min_amount', filters.min_amount.toString());
    if (filters.has_issue !== undefined) params.set('has_issue', String(filters.has_issue));
    const response = await this.request<any>(`${AI_BASE_URL}/v1/orders?${params}`);
    const orders = response.orders || response.items || response.data || (Array.isArray(response) ? response : []);
    return { orders, total: response.total || orders.length };
  }

  async getOrder(orderId: string): Promise<Order> {
    return this.request(`${AI_BASE_URL}/v1/orders/${orderId}`);
  }

  async createOrder(data: Partial<Order>): Promise<Order> {
    return this.request(`${AI_BASE_URL}/v1/orders`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrder(orderId: string, data: Partial<Order>): Promise<Order> {
    return this.request(`${AI_BASE_URL}/v1/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteOrder(orderId: string): Promise<{ status: string }> {
    return this.request(`${AI_BASE_URL}/v1/orders/${orderId}`, { method: 'DELETE' });
  }

  // ==================== TASKS APIs ====================

  async getTasks(filters: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    assigned_agent?: string;
    auto_created?: boolean;
  } = {}): Promise<{ tasks: Task[]; total: number }> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.limit) params.set('limit', filters.limit.toString());
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.assigned_agent) params.set('assigned_agent', filters.assigned_agent);
    if (filters.auto_created !== undefined) params.set('auto_created', String(filters.auto_created));
    const response = await this.request<any>(`${AI_BASE_URL}/v1/tasks?${params}`);
    const tasks = response.tasks || response.items || response.data || (Array.isArray(response) ? response : []);
    return { tasks, total: response.total || tasks.length };
  }

  async getTask(taskId: string): Promise<Task> {
    return this.request(`${AI_BASE_URL}/v1/tasks/${taskId}`);
  }

  async createTask(data: Partial<Task>): Promise<Task> {
    return this.request(`${AI_BASE_URL}/v1/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(taskId: string, data: Partial<Task>): Promise<Task> {
    return this.request(`${AI_BASE_URL}/v1/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(taskId: string): Promise<{ status: string }> {
    return this.request(`${AI_BASE_URL}/v1/tasks/${taskId}`, { method: 'DELETE' });
  }

  // ==================== CAMPAIGNS APIs ====================

  async getCampaigns(filters: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    campaign_type?: string;
  } = {}): Promise<{ campaigns: Campaign[]; total: number }> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.limit) params.set('limit', filters.limit.toString());
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.campaign_type) params.set('campaign_type', filters.campaign_type);
    const response = await this.request<any>(`${AI_BASE_URL}/v1/campaigns?${params}`);
    const campaigns = response.campaigns || response.items || response.data || (Array.isArray(response) ? response : []);
    return { campaigns, total: response.total || campaigns.length };
  }

  async getCampaign(campaignId: string): Promise<Campaign> {
    return this.request(`${AI_BASE_URL}/v1/campaigns/${campaignId}`);
  }

  async createCampaign(data: Partial<Campaign>): Promise<Campaign> {
    return this.request(`${AI_BASE_URL}/v1/campaigns`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCampaign(campaignId: string, data: Partial<Campaign>): Promise<Campaign> {
    return this.request(`${AI_BASE_URL}/v1/campaigns/${campaignId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(campaignId: string): Promise<{ status: string }> {
    return this.request(`${AI_BASE_URL}/v1/campaigns/${campaignId}`, { method: 'DELETE' });
  }

  // ==================== ANALYTICS APIs ====================

  async getAnalyticsOverview(period: string = '30d'): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/analytics/overview?period=${period}`);
  }

  async getConversationTrends(period: string = '7d'): Promise<{ conversation_trends: ConversationTrend[] }> {
    return this.request(`${AI_BASE_URL}/v1/analytics/trends?period=${period}`);
  }

  async getDeviceBreakdown(): Promise<{ devices: DeviceBreakdown[] }> {
    return this.request(`${AI_BASE_URL}/v1/analytics/devices`);
  }

  async getTopicDistribution(period: string = '30d'): Promise<{ topics: TopicDistribution[] }> {
    return this.request(`${AI_BASE_URL}/v1/analytics/topics?period=${period}`);
  }

  async getPerformanceData(): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/analytics/performance`);
  }

  // ==================== KNOWLEDGE BASE APIs ====================

  async getDocuments(): Promise<{ documents: Document[] }> {
    return this.request(`${AI_BASE_URL}/v1/kb/documents`);
  }

  async uploadDocument(file: File): Promise<{ document_id: string; filename: string; status: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.requestFormData(`${AI_BASE_URL}/v1/kb/documents`, formData);
  }

  async getDocument(documentId: string): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/kb/documents/${documentId}`);
  }

  async deleteDocument(documentId: string): Promise<{ status: string }> {
    return this.request(`${AI_BASE_URL}/v1/kb/documents/${documentId}`, {
      method: 'DELETE',
    });
  }

  async downloadDocument(documentId: string) {
    const res = await fetch(
      `${AI_BASE_URL}/v1/kb/documents/${documentId}/download`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );

    if (res.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }

    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (data.download_url) {
        window.open(data.download_url, '_blank');
        return;
      }
      throw new Error('Invalid download response');
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

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

  async addTextSnippet(title: string, content: string): Promise<{ document_id: string; filename: string; status: string }> {
    return this.request(`${AI_BASE_URL}/v1/kb/text`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        text: content,
      }),
    });
  }

  // ==================== INTEGRATIONS APIs ====================

  async getIntegrations(): Promise<{ integrations: Integration[] }> {
    return this.request(`${AI_BASE_URL}/v1/integrations/`);
  }

  async initiateOAuthConnection(type: string, metadata?: Record<string, string>): Promise<{ redirect_url: string; expires_in_seconds: number }> {
    return this.request(`${AI_BASE_URL}/v1/integrations/${type}/connect`, {
      method: 'POST',
      body: JSON.stringify({ metadata: metadata || {} }),
    });
  }

  async disconnectIntegration(type: string): Promise<{ status: string }> {
    return this.request(`${AI_BASE_URL}/v1/integrations/${type}`, {
      method: 'DELETE',
    });
  }

  // ==================== SETTINGS / PROFILE APIs ====================

  async getUserProfile(): Promise<UserProfile> {
    return this.request(`${AI_BASE_URL}/v1/settings/profile`);
  }

  async updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return this.request(`${AUTH_BASE_URL}/v1/users/me`, {
      method: 'PATCH',
    });
  }

  async uploadAvatar(file: File): Promise<{ success: boolean; avatar_url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.requestFormData(`${AUTH_BASE_URL}/v1/users/me/avatar`, formData);
  }

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const profile = await this.getUserProfile() as any;
    const notif = profile.notifications || {};
    return {
      email_enabled: notif.email_enabled ?? true,
      new_conversations: notif.new_conversations ?? true,
      unread_messages: notif.unread_messages ?? false,
      weekly_reports: notif.weekly_reports ?? true,
    };
  }

  async updateNotificationPreferences(data: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    await this.updateUserProfile({ notifications: data } as any);
    return data as NotificationPreferences;
  }

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

  // Team / Workspace Members
  async getTeamMembers(page: number = 1, perPage: number = 20): Promise<{ users?: TeamMember[]; members?: TeamMember[]; total: number }> {
    return this.request(`${AI_BASE_URL}/v1/workspace/members?page=${page}&per_page=${perPage}`);
  }

  async inviteTeamMember(email: string, role: string): Promise<{ status: string }> {
    return this.request(`${AI_BASE_URL}/v1/workspace/members/invite`, {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  }

  async removeTeamMember(memberId: string): Promise<{ status: string }> {
    return this.request(`${AI_BASE_URL}/v1/workspace/members/${memberId}/remove`, {
      method: 'POST',
    });
  }

  async updateUserRole(memberId: string, role: string): Promise<{ status: string }> {
    return this.request(`${AI_BASE_URL}/v1/workspace/members/${memberId}/role?role=${role}`, {
      method: 'PATCH',
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

  // Subscription
  async getSubscription(): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/billing/subscription`);
  }

  async getUsageHistory(): Promise<any> {
    return this.request(`${AI_BASE_URL}/v1/billing/usage`);
  }

  async upgradePlan(planId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`${AUTH_BASE_URL}/v1/billing/subscriptions/${planId}/upgrade`, {
      method: 'POST',
    });
  }

  async getLanguages(): Promise<{ languages: Array<{ code: string; name: string; native_name: string }> }> {
    return this.request(`${AUTH_BASE_URL}/v1/workspace/languages`);
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
