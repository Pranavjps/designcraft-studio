# Frontend Field & Component Specification

This document provides a detailed field-by-field explanation of the "front page" views for all major CRM modules in the application. It details the visible fields, their data types, underlying attributes, and associated UI components, excluding visual design specifics.

---

## 1. Leads Module

**Source File**: `src/pages/Leads.tsx`
**Type Definition**: `src/types/crm.types.ts` (`Lead`, `LeadSource`, `LeadStatus`)

### UI Components Used
- **Main View**: Table / Grid (Toggleable)
- **Filter Panel**: Sidebar with select inputs and range sliders.
- **Create Lead Dialog**: Modal form.
- **Components**: `Badge` (Status/Tags), `Progress` (Lead Score), `Avatar`.

### Field Specifications

| UI Label / Concept | Internal Attribute | Type | Values / Format | Visibility | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Lead Name** | `name` | `string` | Text | Table, Grid, Form | Full name of the potential customer. |
| **Phone** | `phone` | `string` | Phone Format | Table, Grid, Form | Primary contact number. |
| **Email** | `email` | `string?` | Email Format | Table, Grid, Form | Email address (optional). |
| **Lead Source** | `lead_source` | `Enum` | `WhatsApp Bot`, `Instagram DM`, `Facebook Message`, `Google Ads`, `Referral Code`, `Website Chat`, `Marketplace Inquiry`, `Offline Event` | Table, Filter, Form | Origin channel of the lead. |
| **Status** | `lead_status` | `Enum` | `New`, `Contacted`, `Qualified`, `Not Interested`, `Converted`, `Junk` | Table, Filter, Form | Current processing state of the lead. |
| **Lead Score** | `lead_score` | `number` | 0-100 | Table, Filter, Grid | AI-calculated probability of conversion. Visually represented with color-coded bars (Green >80, Blue >60, Yellow <60). |
| **Buying Intent** | `buying_intent_keywords` | `string[]` | Array of strings | Table | Keywords detected indicating purchase intent (e.g., "urgent", "price"). |
| **Interested Products** | `interested_in_products` | `string[]` | Array of strings | Table | List of products the lead has shown interest in. |
| **Budget** | `budget_range` | `string?` | Currency/Range | Table | Estimated spending capacity (e.g., "₹5k-10k"). |
| **Lead Owner** | `lead_owner` | `string?` | Text | Table, Form | Agent responsible for this lead. |
| **Campaign** | `utm_campaign` | `string?` | Text | Table (Secondary) | Marketing campaign associated with the lead. |
| **Referral Code** | `referral_code` | `string?` | Text | Table (Secondary) | Code used if source is Referral. |
| **City** | `city` | `string?` | Text | Grid, Form | Location city. |
| **State** | `state` | `string?` | Text | Grid, Form | Location state. |
| **Converted** | `converted` | `boolean` | `true`/`false` | Table (Badge) | Indicates if lead has become a customer. |

### Filters Available
1.  **Search**: Text search on `name`, `email`, `phone`.
2.  **Lead Source**: Dropdown (All sources).
3.  **Lead Status**: Dropdown (All statuses).
4.  **Min Lead Score**: Range slider (0-100).

---

## 2. Customers Module

**Source File**: `src/pages/Customers.tsx`
**Type Definition**: `src/types/crm.types.ts` (`Customer`, `CustomerSource`, `CustomerStatus`, `ChurnRisk`)

### UI Components Used
- **Main View**: Table / Grid
- **Filter Panel**: Sidebar for segmentation.
- **Top Stats Bar**: Summary cards for Total, Active, Revenue, At Risk.

### Field Specifications

| UI Label / Concept | Internal Attribute | Type | Values / Format | Visibility | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Customer Name** | `customer_name` | `string` | Text | Table, Grid | Name of the customer. |
| **Phone** | `phone` | `string` | Phone Format | Table, Grid | Contact number. |
| **Email** | `email` | `string?` | Email Format | Table, Grid | Email address. |
| **Tags** | `tags` | `string[]?` | Text Tags | Table | Custom labels (e.g., "Premium", "Frequent Buyer"). |
| **Source** | `customer_source` | `Enum` | `WhatsApp`, `Instagram`, `Facebook`, `Google Ads`, `Referral`, `Website`, `Offline Store`, `Marketplace` | Table, Filter | Acquisition channel. |
| **Status** | `customer_status` | `Enum` | `New`, `Active`, `Inactive`, `Churned`, `VIP` | Table, Filter, Grid | Relationship status. |
| **Total Orders** | `total_orders` | `number` | Integer | Table, Filter, Top Stats | Count of completed orders. |
| **Total Revenue** | `total_revenue` | `number` | Currency (INR) | Table, Filter, Top Stats | Lifetime value (LTV) of the customer. |
| **Days Since Order** | `days_since_last_order` | `number?` | Integer (Days) | Table | Recency metric. |
| **AOV** | `average_order_value` | `number?` | Currency (INR) | Table | Average spending per order. |
| **Churn Risk** | `churn_risk` | `Enum` | `Low`, `Medium`, `High` | Table, Filter, Top Stats | AI-predicted risk of leaving. |
| **City/State** | `city`, `state` | `string?` | Text | Table, Grid, Filter | Geographical location. |
| **VIP Indicator** | N/A (Derived) | `Icon` | Star Icon | Grid | Visual indicator if status is 'VIP'. |

### Filters Available
1.  **Search**: Text search on `name`, `phone`, `email`.
2.  **Customer Source**: Dropdown.
3.  **Customer Status**: Dropdown.
4.  **Churn Risk**: Dropdown.
5.  **Min Orders**: Range input (0-50).
6.  **Min Revenue**: Range input (0-100k).
7.  **City**: Text input.

---

## 3. Deals Module (B2B/Sales Pipeline)

**Source File**: `src/pages/Deals.tsx`
**Type Definition**: `src/types/crm.types.ts` (`Deal`, `DealStage`)

### UI Components Used
- **Main View**: Kanban Pipeline (`Pipeline View`) / List (`List View`).
- **Create Deal Dialog**: Modal form.
- **Filter Panel**: Dropdowns for stage, agent, amount.

### Field Specifications

| UI Label / Concept | Internal Attribute | Type | Values / Format | Visibility | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Deal Name** | `deal_name` | `string` | Text | Kanban, List, Form | Name of the opportunity. |
| **Customer** | `customer_id` | `UUID` | Lookup (Customer Name) | Kanban, List, Form | Linked customer. |
| **Products** | `product_names` | `string[]` | Array of Text | Kanban, List, Form | Products involved in the deal. |
| **Stage** | `stage` | `Enum` | `Product Inquiry`, `Price Discussion`, `Ready to Buy`, `Payment Pending`, `Order Placed`, `Closed Won`, `Closed Lost`, `Closed Lost - Price` | Kanban Column, List, Filter, Form | Current pipeline stage. |
| **Amount (Final)** | `final_amount` | `number` | Currency (INR) | Kanban, List, Filter | Deal value after discounts. |
| **Amount (Gross)** | `amount` | `number` | Currency (INR) | List, Form | Initial deal value. |
| **Discount** | `discount_applied` | `number` | Currency (INR) | List, Form | Deduction amount. |
| **Probability** | `probability` | `number` | Percentage (0-100) | Kanban, List, Form | Likelihood of closing. |
| **Expected Close** | `expected_close_date` | `Date` | Date (Short format) | Kanban, List, Form | Target date for closure. |
| **Last Agent** | `last_agent_interaction` | `Enum` | `Sales`, `Marketing`, etc. | Kanban, List, Filter | Last automated agent linked. |
| **Next Step** | `next_step` | `string?` | Text | Form | Actionable next step. |

### Filters Available
1.  **Search**: Text search by deal name or products.
2.  **Stage**: Dropdown `All Stages` or specific stage.
3.  **Last Agent**: Dropdown `All Agents` or specific agent type.
4.  **Min Deal Value**: Number input.

---

## 4. Orders Module

**Source File**: `src/pages/Orders.tsx`
**Type Definition**: `src/types/crm.types.ts` (`Order`, `OrderStatus`, `PaymentStatus`, `IssueType`)

### UI Components Used
- **Main View**: List Table / Grid Cards.
- **Filter Panel**: Dropdowns and checkboxes.
- **Top Stats**: Cards for Total Orders, Total Value, Delivered, Issues.

### Field Specifications

| UI Label / Concept | Internal Attribute | Type | Values / Format | Visibility | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Order #** | `order_number` | `string` | Alphanumeric | Table, Grid | Unique order identifier. |
| **Customer** | `customer_id` | `UUID` | Lookup (Customer Name) | Table, Grid | Ordering customer. |
| **Products** | `product_names` | `string[]` | Array of Text | Table, Grid | Items purchased. |
| **Quantity** | `quantity` | `number` | Integer | Table, Grid | Total items count. |
| **Total Amount** | `total_amount` | `number` | Currency (INR) | Table, Grid, Filter | Final invoice amount. |
| **Payment Method** | `payment_method` | `Enum` | `UPI`, `COD`, `Card`, `Wallet`, `EMI` | Table | Mode of payment. |
| **Payment Status** | `payment_status` | `Enum` | `Pending`, `Paid`, `Failed`, `Refunded`, `Partially Refunded` | Table, Grid, Filter | Financial status. |
| **Order Status** | `order_status` | `Enum` | `Processing`, `Packed`, `Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`, `Returned` | Table, Grid, Filter | Fulfillment lifecycle state. |
| **Tracking #** | `tracking_number` | `string?` | Alphanumeric | Table, Grid | Courier tracking ID. |
| **Courier** | `courier_name` | `string?` | Text | Table, Grid | Logistics provider. |
| **Ordered Date** | `ordered_at` | `Date` | Date (Short) | Table | Date of placement. |
| **Has Issue** | `has_issue` | `boolean` | `true`/`false` | Table (Badge), Filter | Flag for problematic orders. |
| **Issue Type** | `issue_type` | `Enum` | `Delayed`, `Damaged`, `Wrong Product`, `Not Received`, `Quality Issue` | Table (Badge) | Reason for the issue. |

### Filters Available
1.  **Search**: Text search by Order ID, Customer Name, Tracking #.
2.  **Payment Status**: Dropdown.
3.  **Order Status**: Dropdown.
4.  **Min Amount**: Number input.
5.  **Has Issues**: Checkbox (toggle).

---

## 5. Tasks Module

**Source File**: `src/pages/Tasks.tsx`
**Type Definition**: `src/types/crm.types.ts` (`Task`, `TaskStatus`, `TaskPriority`)

### UI Components Used
- **Main View**: Kanban Board / List Table.
- **Create Task Dialog**: Modal form.
- **Stats**: Cards for Total, Open, In Progress, Done.

### Field Specifications

| UI Label / Concept | Internal Attribute | Type | Values / Format | Visibility | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Subject** | `subject` | `string` | Text | Kanban, List, Form | Task title/description. |
| **Status** | `status` | `Enum` | `Open`, `In Progress`, `Done`, `Cancelled` | Kanban Column, List, Form | Workflow state. |
| **Priority** | `priority` | `Enum` | `High`, `Normal`, `Low` | Kanban Badge, List, Form | Urgency level. |
| **Assigned Agent** | `assigned_to_agent` | `Enum` | `Sales`, `Marketing`, etc. | Kanban, List, Filter | Agent responsible. |
| **Due Date** | `due_date` | `Date` | Datetime | Kanban, List, Form | Deadline. red if Overdue. |
| **Related To** | `customer_id` / `deal_id` / `order_id` | `UUID` | Lookup (Entity Name) | Kanban, List, Form | Context (Customer, Deal, or Order). |
| **Auto Created** | `auto_created` | `boolean` | `true`/`false` | Kanban Badge, List, Filter | If created by AI agent automatically. |
| **Notes** | `notes` | `string?` | Text Area | Form | Additional details. |

### Filters Available
1.  **Search**: Text search by subject or notes.
2.  **Status**: Dropdown.
3.  **Priority**: Dropdown.
4.  **Assigned Agent**: Dropdown.
5.  **Auto-Created**: Checkbox.

---

## 6. Campaigns Module

**Source File**: `src/pages/Campaigns.tsx`
**Type Definition**: `src/types/crm.types.ts` (`Campaign`, `CampaignType`, `CampaignStatus`)

### UI Components Used
- **Main View**: List Table / Grid Cards.
- **Stats**: Total Sent, Delivered, Avg Conversion.

### Field Specifications

| UI Label / Concept | Internal Attribute | Type | Values / Format | Visibility | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Campaign Name** | `campaign_name` | `string` | Text | Table, Grid | Name of marketing campaign. |
| **Type** | `campaign_type` | `Enum` | `Lead Generation`, `Nurture`, `Re-engagement`, `Win-Back`, `Promotional` | Table, Grid, Filter | Strategic purpose. |
| **Status** | `status` | `Enum` | `Draft`, `Active`, `Paused`, `Completed` | Table, Grid, Filter | Execution state. |
| **Sent** | `total_sent` | `number` | Integer | Table, Grid, Stats | Total messages/emails sent. |
| **Delivered** | `total_delivered` | `number` | Integer | Table, Grid, Stats | Successful deliveries. |
| **Replies** | `total_replied` | `number` | Integer | Table, Grid | Customer responses. |
| **Conversion** | `total_conversions` | `number` | Integer | Table, Grid, Stats | Goals achieved (e.g. sales). |
| **Date Range** | `start_date` - `end_date` | `Date` | Date (Short) | Table, Grid | Duration of campaign. |

### Filters Available
1.  **Search**: Text search by campaign name.
2.  **Campaign Type**: Dropdown.
3.  **Status**: Dropdown.

---

## 7. Analytics Module

**Source File**: `src/pages/Analytics.tsx`
**Type Definition**: `src/lib/api.ts` (`AnalyticsOverview`, `ConversationTrend`, `DeviceBreakdown`, `PerformanceData`)

### UI Components Used
- **Tabs**: Overview, B2C Metrics, Performance.
- **KPI Cards**: Summary metrics with trend indicators.
- **Charts**: Bar charts (Trends), Donut (Resolution), Progress bars (Devices).
- **Comparison Table**: Bot vs Agent metrics.

### Field Specifications

| UI Label / Concept | Internal Attribute | Type | Values / Format | Visibility | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Total Conversations** | `overview.total_conversations` | `number` | Integer (e.g. 12.8K) | Overview | Total chat volume. |
| **Total Customers** | `overview.total_customers` | `number` | Integer | Overview, B2C | Total reachable audience. |
| **Total Orders** | `overview.total_orders` | `number` | Integer | Overview, B2C | Total commercial transactions. |
| **Total Revenue** | `overview.total_revenue` | `number` | Currency (paise/cents usually formatted) | Overview, B2C | Total sales value. |
| **Active Customers** | `overview.active_customers` | `number` | Integer | B2C Tab | Currently engaging customers. |
| **Churned Customers** | `overview.churned_customers` | `number` | Integer | B2C Tab | Lost customers. |
| **Resolution Rate** | `performance.resolution_rate` | `number` | Percentage | Performance Tab | % of queries resolved by bot. |
| **CSAT** | `performance.customer_satisfaction` | `number` | Decimal (0-5) | Performance Tab | Customer satisfaction score. |
| **Trends (Date)** | `trends[].date` | `string` | Week/Day | Trend Chart | Time bucket for analytics. |
| **Device Type** | `devices[].name` | `string` | Mobile, Desktop, Tablet | Device Chart | User device category. |

### Filters Available
1.  **Time Period**: Dropdown (Last 7 days, 30 days, 90 days).

---

## 8. Contacts Module (General)

**Source File**: `src/pages/Contacts.tsx`
**Type Definition**: `src/types/crm.types.ts` (`Customer`)

### UI Components Used
- **Main View**: List / Grid.
- **Filter Panel**: Detailed sidebar.
- **Create Customer Dialog**: Modal form.

### Field Specifications

| UI Label / Concept | Internal Attribute | Type | Values / Format | Visibility | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Customer Name** | `customer_name` | `string` | Text | Table, Grid | Name of contact. |
| **Contact** | `phone` / `email` | `string` | Phone/Email | Table, Grid | Communication channels. |
| **Source** | `customer_source` | `Enum` | Social, Ads, Referral, etc. | Table, Filter | Origin. |
| **Status** | `customer_status` | `Enum` | New, Active, VIP, etc. | Table, Filter | Engagement level. |
| **Orders** | `total_orders` | `number` | Integer | Table | Order count. |
| **Revenue** | `total_revenue` | `number` | Currency | Table | Total spend. |
| **Churn Risk** | `churn_risk` | `Enum` | Low, Medium, High | Table, Filter | Risk assessment. |
| **Location** | `city`, `state` | `string` | Text | Table, Filter | Geography. |
| **Last Contact** | `last_contacted_at` | `Date` | Relative Time | Table | Last interaction timestamp. |

### Filters Available
1.  **Search**: Name, Phone, Email.
2.  **Source**: Dropdown.
3.  **Status**: Dropdown.
4.  **Churn Risk**: Dropdown.
5.  **City**: Text input.
6.  **Min Orders/Revenue**: Numeric inputs.

---

## 9. Conversations Module

**Source File**: `src/pages/Conversations.tsx`
**Type Definition**: `src/lib/api.ts` (`Conversation`, `Message`)

### UI Components Used
- **Sidebar List**: List of active chats.
- **Chat Window**: Message bubble stream.
- **Contact Sidebar**: Details of the current chat user.

### Field Specifications

| UI Label / Concept | Internal Attribute | Type | Values / Format | Visibility | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Conversation Name** | `name` | `string` | Text | Sidebar List | Contact name. |
| **Last Message** | `last_message` | `string` | Text | Sidebar List | Preview of last text. |
| **Last Seen** | `last_seen_at` | `string` | Relative Time | Sidebar List | User online status. |
| **Unread Count** | `unread_count` | `number` | Integer | Sidebar List (Badge) | Number of new messages. |
| **Message Body** | `body` | `string` | Text | Chat Window | Content of message. |
| **Direction** | `direction` | `Enum` | `inbound`, `outbound` | Chat Window | Sender/Receiver logic. |
| **Message Status** | `status` | `Enum` | `read`, `sent`, `sending` | Chat Window | Delivery state. |
| **Role** | `role` | `Enum` | `user`, `assistant` | Chat Window | Who sent the message. |

### Filters Available
1.  **Search**: Conversation name.
2.  **Filter Tabs**: All, Unread, Archived.

---

## 10. Dashboard Module

**Source File**: `src/pages/Dashboard.tsx`
**Type Definition**: Local constants (mock)

### UI Components Used
- **Stats Row**: High-level metrics.
- **Active Status Bar**: Real-time call count.
- **Cards**: Success rate, Agent stats, Language.

### Field Specifications

| UI Label / Concept | Internal Attribute | Type | Values / Format | Visibility | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Active Calls** | N/A | `number` | Integer | Status Bar | Currently active sessions. |
| **Number of Calls** | `value` | `string` | Metric | Stats Row | Total calls. |
| **Average Duration** | `value` | `string` | Time (mm:ss) | Stats Row | Avg call length. |
| **Total Cost** | `value` | `string` | Credits | Stats Row | Usage cost. |
| **LLM Cost** | `value` | `string` | Currency | Stats Row | AI inference cost. |
| **Success Rate** | N/A | `percentage` | 0-100% | Chart | Overall performance. |

### Filters Available
1.  **Agent**: Select specific agent.
2.  **Time Period**: Last week/month/year.

---

## 11. Documents Module

**Source File**: `src/pages/Documents.tsx`
**Type Definition**: Local Interface `Document`

### UI Components Used
- **Main View**: Grid / List.
- **Sidebar**: Folders and Filters.
- **Upload Dialog**: Drag and drop form.

### Field Specifications

| UI Label / Concept | Internal Attribute | Type | Values / Format | Visibility | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Name** | `name` | `string` | Text | Grid, List | File name. |
| **Type** | `type` | `Enum` | `pdf`, `document`, `spreadsheet`, `image`... | Grid, List, Filter | File MIME type category. |
| **Folder** | `folder` | `string` | Text | Grid, List, Sidebar | Directory category. |
| **Status** | `status` | `Enum` | `draft`, `approved`, `ready`, `processing` | Grid, List, Filter | Document workflow state. |
| **Size** | `size` | `number` | Bytes | Grid, List | File size (formatted). |
| **Owner** | `owner` | `string` | Text | List | Uploader name. |
| **Modified** | `modifiedTime` | `Date` | Date | List, Details | Last edit time. |
| **Locked** | `isLocked` | `boolean` | `true`/`false` | Icon | If file is read-only/locked. |

### Filters Available
1.  **Search**: File name.
2.  **File Type**: Dropdown.
3.  **Status**: Dropdown.
4.  **Folder**: Sidebar selection.

---

## 12. Index Module

**Source File**: `src/pages/Index.tsx`
**Type Definition**: N/A

### Description
Simple landing/welcome page. No substantial fields or data.
- **Content**: "Welcome to Your Blank App".

---

## 13. Integrations Module

**Source File**: `src/pages/Integrations.tsx`
**Type Definition**: `src/lib/api.ts` (`Integration`)

### UI Components Used
- **Card Grid**: Connected vs Available integrations.
- **Toggle**: Switch for enabling/disabling.
- **Connect Dialog**: Form for API keys.

### Field Specifications

| UI Label / Concept | Internal Attribute | Type | Values / Format | Visibility | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Integration Name** | `name` | `string` | WhatsApp, Shopify, etc. | Card | Service name. |
| **Type** | `type` | `Enum` | `whatsapp`, `shopify`, `stripe`... | Card | Internal service identifier. |
| **Status** | `status` | `Enum` | `connected`, `available` | Card | Connection state. |
| **Enabled** | `enabled` | `boolean` | Switch | Card | Active/Inactive toggle. |
| **Config** | `config` | `Object` | Key-value pairs | Dialog | API keys, URLs, secrets. |

---

## 14. KnowledgeBase Module

**Source File**: `src/pages/KnowledgeBase.tsx`
**Type Definition**: `src/lib/api.ts` (`Document`)

### UI Components Used
- **Main View**: Grid / List.
- **Search**: Top bar.
- **Upload / Add Text**: Action buttons.

### Field Specifications

| UI Label / Concept | Internal Attribute | Type | Values / Format | Visibility | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Filename** | `filename` | `string` | Text | Grid, List | Name of KB source file. |
| **Content Type** | `content_type` | `string` | MIME type | Icon | File format. |
| **Status** | `status` | `Enum` | `ready`, `processing`, `failed` | Badge, Filter | Ingestion status. |
| **Uploaded** | `uploaded_at` | `DateString` | Date | Card, List | Creation time. |

### Filters Available
1.  **Search**: Filename.
2.  **Status**: Dropdown.

---

## 15. Login Module

**Source File**: `src/pages/Login.tsx`
**Type Definition**: Form State

### Field Specifications

| UI Label / Concept | Internal Attribute | Type | Values / Format | Visibility | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Email** | `email` | `string` | Email | Form | User email credential. |
| **Password** | `password` | `string` | Password | Form | User password. |
| **Remember me** | `rememberMe` | `boolean` | `true`/`false` | Form | Session persistence. |

---

## 16. NotFound Module

**Source File**: `src/pages/NotFound.tsx`
**Type Definition**: N/A

### Description
Standard 404 Error page. No data fields.

---

## 17. Settings Module

**Source File**: `src/pages/Settings.tsx`
**Type Definition**: `src/lib/api.ts` (`UserProfile`, `NotificationPreferences`)

### UI Components Used
- **Tabs**: Vertical/Horizontal tabs for categories.
- **Cards**: Grouping settings.

### Field Specifications

| UI Label / Concept | Internal Attribute | Type | Values / Format | Visibility | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Avatar** | `avatar_url` | `string` | URL | Profile | Profile picture. |
| **Name** | `name` | `string` | Text | Profile, Team | User/Member name. |
| **Email** | `email` | `string` | Email | Profile, Team | User/Member email. |
| **Role** | `role` | `Enum` | `admin`, `owner`, `user` | Profile, Team | Permission level. |
| **Company** | `tenant.name` | `string` | Text | Profile | Organization name. |
| **Notifications** | `email_enabled`, `new_conversations`... | `boolean` | Switch | Notifications | User preferences. |
| **Language** | `language` | `Enum` | `en`, `es`, `fr`... | Language Tab | Interface language. |
| **Theme** | `theme` | `Enum` | `light`, `dark`, `system` | Appearance Tab | Color scheme. |

---

## 18. SignUp Module

**Source File**: `src/pages/SignUp.tsx`
**Type Definition**: Form State (Multi-step)

### Field Specifications

| UI Label / Concept | Internal Attribute | Type | Values / Format | Visibility | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Full Name** | `name` | `string` | Text | Step 1 | User name. |
| **Email** | `email` | `string` | Email | Step 1 | Account email. |
| **Password** | `password` | `string` | Password | Step 1 | Account password (strength meter). |
| **Company Name** | `company` | `string` | Text | Step 2 | Organization. |
| **Website** | `website` | `string` | URL | Step 2 | Company site. |
| **Team Size** | `teamSize` | `Enum` | `1-10`, `11-50`... | Step 2 | Company size. |
| **Phone** | `phone` | `string` | Phone | Step 2 | Contact number. |
