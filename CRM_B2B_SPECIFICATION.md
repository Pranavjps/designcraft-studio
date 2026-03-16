# 1️⃣ LEADS MODULE – COMPLETE DETAIL

## A. LEADS – PURPOSE
Represents unqualified / incoming prospects from multiple channels before conversion to Contact + Account + Deal.

## B. LEADS – CREATE FORM (FIELD-BY-FIELD)

### 1. Lead Identity
| Field | Type | Notes |
| :--- | :--- | :--- |
| Lead Image | Image | Optional |
| Lead Owner | User (Lookup) | Sales agent / owner |
| First Name | Text | Optional |
| Last Name | Text | Mandatory |
| Company | Text | Mandatory |
| Title | Text | Job title |

### 2. Communication Details
| Field | Type | Notes |
| :--- | :--- | :--- |
| Phone | Phone | |
| Mobile | Phone | |
| Email | Email | |

### 3. Lead Source (CUSTOMIZED – YOUR INPUT)
**Picklist (Multi-Source Mapping):**

* **Primary Lead Source**
    * Social Media
    * WhatsApp
    * Facebook
    * Instagram
    * Advertisement (Campaign)
    * Cold Call
    * Referral
    * Offline Store
    * Manual Upload
    * Sales Email Alias
    * Live Chat, Online Store

**🔹 Can be implemented as:**
* Lead Source (Parent)
* Lead Sub-Source

### 4. Lead Status (WHERE lead currently is)
**Picklist:**
* Attempted to Contact
* Contact in Future
* Contacted
* Not Contacted
* Pre-Qualified
* Qualified
* Not Qualified
* Junk Lead
* Lost Lead

### 5. Lead Ranking (Business Outcome)
**Picklist:**
* Acquired
* Active
* Market Failed
* Project Cancelled
* Shut Down

### 6. Lead Tone / Behaviour (Sales Psychology)
**Picklist:**
* Cool
* Eager
* Interested
* Anger

### 7. Lead Signals / Lead Quality (AI-READY)
| Signal | Type |
| :--- | :--- |
| Message Frequency | Numeric |
| Buying Intent Keywords | Multi-select / Text |
| Response Latency | Time (mins / hrs) |
| Lead Signal Score | Calculated (+ / -) |

### 8. Lead Score
| Field | Type |
| :--- | :--- |
| Lead Score | Number (Auto calculated) |

### 9. Company & Business Info
| Field | Type |
| :--- | :--- |
| Industry | Picklist |
| Annual Revenue | Currency |
| No. of Employees | Number |
| Rating | Picklist |

### 10. Address Information
| Field | Type |
| :--- | :--- |
| Country / Region | Picklist |
| Flat / House / Building | Text |
| Street Address | Text |
| City | Text |
| State / Province | Picklist |
| Zip / Postal Code | Text |

### 11. Description
| Field | Type |
| :--- | :--- |
| Description | Long Text |

## C. LEADS – TABLE (LIST VIEW COLUMNS)
* Checkbox
* Lead Name
* Company
* Phone
* Email
* Lead Source
* Lead Status
* Lead Score
* Lead Owner
* Created Time

## D. LEADS – FILTERS
**System Filters:**
* Touched Records
* Untouched Records
* Record Action
* Related Records Action
* Locked

**Field Filters (Examples):**
* Lead Source
* Lead Status
* Ranking
* Lead Score
* Industry
* City / Country
* Created Time
* Owner

## E. LEADS – UPPER TABS (RECORD VIEW)
* Activities (Tasks / Calls / Meetings)
* Emails
* Campaigns
* Notes
* Attachments
* Social
* Timeline

---

# 2️⃣ CONTACTS MODULE – COMPLETE DETAIL

## A. CONTACTS – PURPOSE
Represents qualified people linked to Accounts and Deals.

## B. CONTACTS – CREATE FORM

### 1. Contact Identity
| Field | Type |
| :--- | :--- |
| Contact Image | Image |
| Contact Owner | User |
| First Name | Text |
| Last Name | Text |
| Account Name | Lookup (Account) |
| Vendor Name | Lookup |

### 2. Communication
| Field | Type |
| :--- | :--- |
| Email | Email |
| Secondary Email | Email |
| Phone | Phone |
| Other Phone | Phone |
| Mobile | Phone |
| Assistant | Text |

### 3. Professional Details
| Field | Type |
| :--- | :--- |
| Title | Text |
| Department | Text |
| Lead Source | Picklist |
| Reporting To | Lookup (Contact) |

### 4. Personal Info
| Field | Type |
| :--- | :--- |
| Date of Birth | Date |

### 5. Address Information
**Mailing Address:**
* Country / Region
* Flat / House / Building
* Street
* City
* State / Province
* Zip
* Latitude
* Longitude

**Other Address:** (same fields)

### 6. Description
| Field | Type |
| :--- | :--- |
| Description | Long Text |

## C. CONTACTS – TABLE COLUMNS
* Contact Name
* Account Name
* Email
* Phone
* Owner
* Created Time

## D. CONTACTS – FILTERS
* Touched / Untouched
* Locked
* Activities
* Campaigns
* Cadences
* Email Status
* Account Name
* City / Country
* Created Time

## E. CONTACTS – RELATED TABS
* Deals
* Activities
* Emails
* Campaigns
* Quotes
* Sales Orders
* Invoices
* Notes
* Attachments

---

# 3️⃣ DEALS (POTENTIALS) – COMPLETE DETAIL

## A. DEALS – PURPOSE
Represents active sales opportunities.

## B. DEAL STAGES (WHERE THE SALE IS)
**Pipeline Stages:**
* Qualification
* Needs Analysis
* Value Proposition
* Identify Decision Makers
* Proposal / Price Quote
* Negotiation / Review
* Closed Won
* Closed Lost
* Closed Lost to Competition

## C. DEAL – CREATE FORM

### Deal Information
| Field | Type |
| :--- | :--- |
| Deal Owner | User |
| Deal Name | Text |
| Account Name | Lookup |
| Contact Name | Lookup |
| Type | Picklist |
| Lead Source | Picklist |
| Campaign Source | Lookup |
| Next Step | Text |

### Revenue & Forecast
| Field | Type |
| :--- | :--- |
| Amount | Currency |
| Closing Date | Date |
| Stage | Picklist |
| Probability (%) | Number |
| Expected Revenue | Currency (Auto) |

### Description
| Field | Type |
| :--- | :--- |
| Description | Long Text |

## D. DEAL VIEW TYPES
* List View
* Stage View (Kanban)
* Forecast View

## E. DEAL LOGIC (IMPORTANT)
**🔹 Deal progress happens ONLY via TASKS**
* Stage change = task completion
* Next Step = next task subject
* Probability auto-updates by stage

## F. DEAL – RELATED TABS
* Tasks
* Calls
* Meetings
* Products
* Quotes
* Emails
* Notes
* Attachments
* Stage History

---

# 4️⃣ TASKS MODULE – COMPLETE DETAIL

## A. TASKS – PURPOSE
Defines WHAT must be done to move Lead / Deal forward

## B. TASK OWNERSHIP (ROLES)
* Sales Agent
* Support
* Finance
* Refund
* Operations
* Custom Teams

## C. TASK – CREATE FORM

### Task Information
| Field | Type |
| :--- | :--- |
| Task Owner | User |
| Subject | Text |
| Due Date | Date |

### Relation
| Field | Type |
| :--- | :--- |
| Lead | Lookup |
| Contact | Lookup |
| Account | Lookup |
| Deal | Lookup |

### Status
**Picklist:**
* Not Started
* In Progress
* Completed
* Waiting for Input
* Deferred

### Priority
**Picklist:**
* Highest
* High
* Normal
* Low
* Lowest

### Reminder & Repeat
| Field | Type |
| :--- | :--- |
| Reminder | Toggle |
| Repeat | Toggle |

### Description
| Field | Type |
| :--- | :--- |
| Description | Long Text |

## D. TASK VIEWS
* List View
* Status Board View
* Overdue View
* My Tasks
* Next 7 Days

---

# 5️⃣ DOCUMENTS MODULE – COMPLETE DETAIL

## A. DOCUMENTS – PURPOSE
Centralized sales + legal + marketing + proposal repository

## B. DOCUMENT TYPES
* Folders
* Documents
* Spreadsheets
* Presentations
* PDFs
* Images
* Audio
* Videos
* Links

## C. DOCUMENT FIELDS
| Field | Type |
| :--- | :--- |
| Document Name | Text |
| Owner | User |
| Folder | Folder |
| File Type | System |
| Version | System |
| Status | Draft / Approved |
| Modified Time | DateTime |
| Description | Text |

## D. DOCUMENT ACTIONS
* Upload
* Download
* Share
* Lock / Unlock
* Version History
* Attach to Leads / Deals / Contacts

## E. DOCUMENT FILTERS
* File Type
* Owner
* Modified Date
* Folder
* Shared With Me

---

# 🔥 FINAL ARCHITECTURE NOTE (VERY IMPORTANT)
✔ Lead → Contact + Account + Deal
✔ Deal movement = Task driven
✔ Lead Score + Signals = AI / Automation ready
✔ Documents = Shared across all modules
✔ Status, Stage & Priority are decoupled but linked

---

# 6️⃣ REQUIRED CORRECTIONS (FROM B2C TO B2B)

The current frontend does not align with the detailed specification.

**Module Type Mismatch (B2C vs. B2B):**
* **Current Code:** Built as a B2C CRM (Leads → Customers → Orders). It uses "Customers" instead of "Contacts" and lacks the "Account" (Company) entity entirely.
* **Your Spec:** Describes a standard B2B/Enterprise CRM (Leads → Contacts + Accounts → Deals).

**Leads Module:**
* **Missing Fields:** Lead Image, Company, Title, Mobile, Lead Signals, Tone/Behaviour, Annual Revenue, Rating.
* **Status & Sources:** The code uses "New", "Converted", "Junk" (B2C style) whereas your spec lists detailed sales stages like "Attempted to Contact", "Pre-Qualified", "Market Failed", etc.

**Contacts Module:**
* **Wrong Entity:** Implemented as `Contacts.tsx` but logically represents "Customers" (B2C).
* **Missing Relationships:** No lookup fields for Account Name, Vendor Name, or Reporting To.
* **Missing Fields:** Department, Date of Birth, Assistant, Mailing Address details.

**Deals Module:**
* **Stages Mismatch:** Current stages are transaction-based (Product Inquiry, Order Placed) vs. your sales-process stages (Qualification, Value Proposition, Negotiation).
* **Logic:** The "Task-driven stage progression" logic is missing.

**Tasks Module:**
* **Roles:** Missing specific roles like Refund, Operations, Custom Teams.
* **Fields:** Missing Priority levels (Highest/Lowest) and Status options (Waiting for Input, Deferred).

**Action Required:**
Refactor the data model and UI from a B2C structure to the B2B architecture described in the specification above.
