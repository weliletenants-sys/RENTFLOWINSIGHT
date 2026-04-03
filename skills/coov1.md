# COO Dashboard — Complete Documentation v1.0

**Last Updated:** 2026-04-03
**Author:** Welile Platform Team
**Audience:** Internal agents, new hires, support staff, and developers

---

## Table of Contents

1. [Overview](#1-overview)
2. [Access & Authentication](#2-access--authentication)
3. [Dashboard Architecture](#3-dashboard-architecture)
4. [Overview Page (Home View)](#4-overview-page-home-view)
5. [Financial Metrics Cards (KPIs)](#5-financial-metrics-cards-kpis)
6. [Quick Navigation Grid](#6-quick-navigation-grid)
7. [Rent Approvals](#7-rent-approvals)
8. [Wallets & Ops (Financial Operations Command Center)](#8-wallets--ops-financial-operations-command-center)
9. [Transactions](#9-transactions)
10. [Agent Collections](#10-agent-collections)
11. [Withdrawal Approvals](#11-withdrawal-approvals)
12. [Agent Activity](#12-agent-activity)
13. [Payment Analytics](#13-payment-analytics)
14. [Partners Management](#14-partners-management)
15. [Financial Reports](#15-financial-reports)
16. [Risk & Alerts](#16-risk--alerts)
17. [Partner Top-ups](#17-partner-top-ups)
18. [Staff Performance](#18-staff-performance)
19. [Recruit Supporter](#19-recruit-supporter)
20. [Summary Panels (Overview Page)](#20-summary-panels-overview-page)
21. [Legacy COO Dashboard](#21-legacy-coo-dashboard)
22. [COO Detail Layout & Shared Components](#22-coo-detail-layout--shared-components)
23. [Data Table Component (COODataTable)](#23-data-table-component-coodatatable)
24. [Mobile Responsiveness](#24-mobile-responsiveness)
25. [Relationships & Data Flow](#25-relationships--data-flow)

---

## 1. Overview

The **COO Dashboard** is the Chief Operating Officer's command center for Welile's financial and operational oversight. It provides:

- **Real-time financial KPIs** — rent collected, payments today/month, wallet balances, pending approvals, failed transactions
- **Multi-level approval workflows** — rent approvals, wallet withdrawals, partner capital withdrawals
- **Agent performance monitoring** — collections, visits, payment modes
- **Partner capital management** — portfolios, ROI, imports, contribution date corrections
- **Risk detection** — large payments, failed withdrawals, anomaly alerts
- **Downloadable financial reports** — daily, weekly, monthly, agent-specific

**Route:** `/coo/dashboard` (primary) or `/coo-dashboard` (legacy redirect)

**Roles with access:** `coo`, `super_admin`, `cto`

---

## 2. Access & Authentication

### Route Guard

The COO dashboard is protected by `<RoleGuard allowedRoles={['coo', 'super_admin', 'cto']}>`. Users without one of these roles are redirected.

### Audit Logging

Every time the COO dashboard is opened, an audit log entry is created:

```
Table: audit_logs
Action: dashboard_accessed
Metadata: { dashboard: 'coo', timestamp: '...' }
```

This creates an auditable record of who accessed the dashboard and when.

### Layout

The dashboard uses `ExecutiveDashboardLayout`, which provides:
- A responsive sidebar (desktop) or hamburger drawer (mobile) with section-based navigation
- A role switcher allowing users with multiple roles (e.g., `coo` + `manager`) to switch contexts
- A "Back to Dashboard" exit button
- Sticky header with role label ("COO")

---

## 3. Dashboard Architecture

The COO dashboard follows a **state-driven sub-view pattern** — a single React component manages an `activeTab` state that determines which content panel to render. This replaces traditional page-based routing with inline navigation.

### Navigation Flow

```
Overview (default)
  ├── Quick Nav Card clicked → sets activeTab → renders sub-view inline
  ├── Sidebar item clicked → sets activeTab or navigates to route
  └── Back button → returns to overview
```

### Sub-Views Available

| `activeTab` Value | Component Rendered | Description |
|---|---|---|
| `overview` (default) | RentPipelineQueue + FinancialMetricsCards + Quick Nav Grid + Summary Panels | Home view |
| `rent-approvals` | `RentPipelineQueue` (stage: `landlord_ops_approved`) | Rent requests awaiting COO sign-off |
| `wallets` | `FinancialOpsCommandCenter` | Full financial operations suite |
| `transactions` | `FinancialTransactionsTable` | Paginated general ledger explorer |
| `collections` | `AgentCollectionsOverview` | Agent collection performance table |
| `withdrawals` | `COOWithdrawalApprovals` + `COOPartnerWithdrawalApprovals` | Final approval queues |
| `agent-activity` | `CashoutAgentActivity` | Live agent tracking |
| `analytics` | `PaymentModeAnalytics` | Payment method distribution pie chart |
| `partners` | `COOPartnersPage` | Full partner management suite |
| `reports` | `FinancialReportsPanel` | CSV report generators |
| `alerts` | `FinancialAlertsPanel` | Risk detection and anomaly flags |
| `partner-topups` | `PendingPortfolioTopUps` | Pending capital injections awaiting verification |
| `staff-performance` | `StaffPerformancePanel` | Team performance metrics |

---

## 4. Overview Page (Home View)

When `activeTab === 'overview'`, the home view renders four sections in order:

### 4.1 Priority: Rent Approval Queue

At the very top, a `RentPipelineQueue` component is rendered with `stage="landlord_ops_approved"`. This immediately shows the COO any rent requests that have passed Landlord Ops review and require operational sign-off before forwarding to the CFO.

**Use Case:** The COO opens their dashboard in the morning and immediately sees 3 rent requests awaiting sign-off. They can approve/reject without navigating anywhere.

### 4.2 Financial Metrics Cards

Seven color-coded KPI tiles showing real-time financial health. See [Section 5](#5-financial-metrics-cards-kpis) for full detail.

### 4.3 Quick Navigation Grid

Twelve touch-optimized cards for navigating to sub-views. See [Section 6](#6-quick-navigation-grid) for full detail.

### 4.4 Summary Panels

Two side-by-side panels at the bottom:
- **Payment Mode Analytics** — Pie chart showing how collections break down by payment method
- **Financial Alerts** — List of risk flags (large payments, failed withdrawals)

---

## 5. Financial Metrics Cards (KPIs)

**Component:** `FinancialMetricsCards` (`src/components/coo/FinancialMetricsCards.tsx`)

This component renders 7 financial KPI tiles in a responsive grid (2 cols mobile, 3 cols tablet, 4 cols desktop).

### Data Sources

All data is fetched in a single parallel `Promise.all` from these tables:

| Query | Table | Filter | Purpose |
|---|---|---|---|
| Rent collected (all time) | `general_ledger` | `category = 'rent_repayment'` AND `direction = 'cash_in'` | Total rent repayments received |
| Payments today | `general_ledger` | `transaction_date >= today` | Today's cash flow |
| Payments this month | `general_ledger` | `transaction_date >= 1st of month` | Monthly cash flow |
| Agent collections | `agent_collections` | All records | Total collected via agents |
| System wallet balance | `wallets` | All records | Sum of all wallet balances |
| Pending approvals | `withdrawal_requests` | `status = 'pending'` | Count of unprocessed withdrawals |
| Failed transactions | `withdrawal_requests` | `status = 'failed'` | Count of failed withdrawals |

### KPI Cards Detail

#### 1. Total Rent Collected
- **Icon:** Banknote (green)
- **Value:** Sum of all `amount` from `general_ledger` where `category = 'rent_repayment'` and `direction = 'cash_in'`
- **Health Status:** Always green
- **Use Case:** Quick glance at total rent repayment revenue. If this number stagnates, investigate collection pipeline.
- **Example:** `UGX 45,230,000`

#### 2. Payments Today
- **Icon:** TrendingUp (green)
- **Value:** Sum of all `amount` from `general_ledger` where `transaction_date >= start of today`
- **Health Status:** Always green
- **Use Case:** Monitor daily financial throughput. Compare with previous days mentally. Low activity early in the day is normal; zero by afternoon warrants investigation.
- **Example:** `UGX 1,200,000`

#### 3. Payments This Month
- **Icon:** TrendingUp (green)
- **Value:** Sum of all `amount` from `general_ledger` where `transaction_date >= 1st of current month`
- **Health Status:** Always green
- **Use Case:** Track monthly financial volume. Use for month-end reporting and comparing month-over-month growth.
- **Example:** `UGX 12,800,000`

#### 4. Agent Collections
- **Icon:** Users (green)
- **Value:** Sum of all `amount` from `agent_collections`
- **Health Status:** Always green
- **Use Case:** Total money collected by field agents from tenants. This is the front-line revenue capture metric.
- **Example:** `UGX 8,500,000`

#### 5. System Wallet Balance
- **Icon:** Wallet
- **Value:** Sum of all `balance` from `wallets`
- **Health Status:** Green if balance > 0, **Red** if balance = 0
- **Use Case:** Critical liquidity indicator. If this goes to zero, the platform cannot process payouts. Red status = immediate action required.
- **Example:** `UGX 3,200,000` (green) or `UGX 0` (red — ACTION REQUIRED)

#### 6. Pending Approvals
- **Icon:** Clock
- **Value:** Count of `withdrawal_requests` where `status = 'pending'`
- **Health Status:** Yellow if count > 5, Green otherwise
- **Use Case:** Backlog indicator. If pending count grows, approvals are lagging. The COO should clear the queue or investigate why CFO hasn't processed them.
- **Example:** `3` (green) or `12` (yellow — Monitor)

#### 7. Failed Transactions
- **Icon:** AlertTriangle
- **Value:** Count of `withdrawal_requests` where `status = 'failed'`
- **Health Status:** **Red** if count > 0, Green if zero
- **Use Case:** Immediate attention required. Any failed transaction means money was supposed to move but didn't. Could be MoMo API failure, insufficient float, or system error.
- **Example:** `0` (green) or `2` (red — ACTION REQUIRED)

### Caching

- `staleTime: 5 minutes` — data refreshes every 5 minutes on window focus
- Query key: `['coo-financial-metrics']`

---

## 6. Quick Navigation Grid

Twelve cards arranged in a responsive grid (2 cols mobile, 3 cols tablet, 4 cols desktop). Each card has:

- **Icon** — Visual identifier
- **Label** — Short name (e.g., "Rent Approvals")
- **Description** — One-line summary (e.g., "Review & approve")
- **Color scheme** — Unique background/text/border color per card
- **Chevron** — Right arrow indicating navigability

### Cards

| # | Label | Icon | Color | Description | Navigates to |
|---|---|---|---|---|---|
| 1 | Rent Approvals | ClipboardList | Blue | Review & approve | `rent-approvals` |
| 2 | Wallets & Ops | Wallet | Primary/Purple | Deposits & payouts | `wallets` |
| 3 | Transactions | BarChart3 | Amber | Monitor activity | `transactions` |
| 4 | Collections | Users | Emerald | Agent reports | `collections` |
| 5 | Withdrawals | Banknote | Red | Approve payouts | `withdrawals` |
| 6 | Agent Activity | Activity | Purple | Live tracking | `agent-activity` |
| 7 | Analytics | BarChart3 | Teal | Payment modes | `analytics` |
| 8 | Partners | Handshake | Indigo | Manage partners | `partners` |
| 9 | Reports | FileText | Sky | Financial reports | `reports` |
| 10 | Alerts | AlertTriangle | Orange | Risk & flags | `alerts` |
| 11 | Partner Top-ups | TrendingUp | Green | Pending top-ups | `partner-topups` |
| 12 | Staff | UserCheck | Pink | Team metrics | `staff-performance` |

### Recruit Supporter Button

Above the Quick Nav grid, a `ShareSupporterRecruit` button appears. This allows the COO to generate a referral link that, when shared (via copy/paste, WhatsApp, or native share), registers new users with the `supporter` role under the COO's referral.

---

## 7. Rent Approvals

**Component:** `RentPipelineQueue` (from `src/components/executive/RentPipelineQueue.tsx`)
**Stage Filter:** `landlord_ops_approved`

### What It Does

Displays rent requests that have been approved by Landlord Operations and now require COO sign-off. This is step 2 in the multi-stage rent approval pipeline:

```
Tenant applies → Agent submits → Landlord Ops approves → COO approves → CFO funds
```

### Use Cases

1. **Daily review:** COO opens dashboard, sees 5 pending rent approvals at the top, reviews each (tenant name, rent amount, landlord, agent), and approves or rejects
2. **Rejection:** If the COO suspects fraud or finds discrepancies, they can reject with a reason that's recorded in the audit trail
3. **Bottleneck detection:** If rent approvals pile up, it indicates either Landlord Ops is backlogged or COO hasn't reviewed in days

### Context Message

> "Review rent requests approved by Landlord Ops. Your sign-off forwards to CFO for payout."

---

## 8. Wallets & Ops (Financial Operations Command Center)

**Component:** `FinancialOpsCommandCenter` (from `src/components/financial-ops/FinancialOpsCommandCenter.tsx`)

This is a full financial operations suite embedded within the COO dashboard. It provides:

- **Verify Deposits** — Review and confirm tenant deposit submissions
- **Withdrawals & Payouts** — Process wallet withdrawal requests
- **Capital Opportunities** — View available capital deployment options
- **Wallet Deductions** — Manual deductions for corrections/adjustments
- **Approval Queue** — Centralized queue for all pending financial actions
- **Transaction Search** — Search by reference ID, amount, party name
- **Reconciliation** — Match bank statements with platform records
- **Ledgers** — Access to advanced ledger views (Suspense, Defaults, Capital, Commissions, Revenue, Settlement)
- **Audit Trail** — Chronological log of all financial actions

### Layout

The Command Center uses a mobile-first design with:
- **Primary actions** (Verify Deposits, Withdrawals) prominently displayed
- **Secondary tools** consolidated in a "More Tools" bottom sheet

### Relationship to COO Dashboard

The Command Center is the COO's day-to-day operational tool. While the overview page shows high-level metrics, this page is where the COO *does work* — verifying deposits, processing payouts, investigating transactions.

---

## 9. Transactions

**Component:** `FinancialTransactionsTable` (`src/components/coo/FinancialTransactionsTable.tsx`)

### What It Does

A full-featured, paginated, server-side filtered table showing all entries from the `general_ledger` table.

### Features

| Feature | Detail |
|---|---|
| **Search** | Debounced (400ms) text search across reference ID, linked party, category |
| **Direction filter** | Dropdown: All Flow / Cash In / Cash Out |
| **Category filter** | Dropdown populated dynamically from distinct `general_ledger.category` values |
| **Pagination** | Server-side, 50 rows per page. Uses `get_paginated_transactions` RPC |
| **CSV Export** | Downloads current filtered view as CSV file |
| **Total count** | Displayed in header (e.g., "12,345 total transactions") |

### Table Columns

| Column | Description | Example |
|---|---|---|
| Date | Transaction date with time below | `Apr 3, 2026` / `14:32` |
| Reference | First 13 chars of `reference_id` | `TXN-abc123456` |
| Category | Ledger category badge | `rent repayment` |
| Direction | Cash In (↓ IN, green) or Cash Out (↑ OUT) | `↓ IN` |
| Amount | Formatted UGX, green for cash_in | `+UGX 250,000` |
| Linked Party | Who the transaction involves | `John Doe` |
| Description | Transaction description | `Monthly rent payment` |

### Backend

Uses the `get_paginated_transactions` RPC function which accepts:
- `p_limit` (50)
- `p_offset` (page * 50)
- `p_direction` (null for all, or 'cash_in'/'cash_out')
- `p_category` (null for all, or specific category)
- `p_search` (null or search text)

Returns rows with a `total_count` field for pagination calculations.

### Use Case

The COO receives a report that a tenant claims they paid but it's not reflected. The COO opens Transactions, searches by the tenant name or MoMo reference ID, and can see the exact ledger entry (or lack thereof) to resolve the dispute.

---

## 10. Agent Collections

**Component:** `AgentCollectionsOverview` (`src/components/coo/AgentCollectionsOverview.tsx`)

### What It Does

Displays a performance summary table of all agents who have made rent collections, broken down by time period.

### Data Sources

- `agent_collections` — all collection records (agent_id, amount, created_at)
- `agent_visits` — all visit records (agent_id, id)
- `profiles` — agent names (id, full_name)

### Table Columns

| Column | Description | Example |
|---|---|---|
| Agent | Agent's full name from profiles | `Brian Ssemakula` |
| Today | Sum of collections created today | `UGX 120,000` |
| This Week | Sum of collections this week (Mon-Sun) | `UGX 890,000` |
| This Month | Sum of collections this month | `UGX 2,340,000` |
| Visits | Total visit count for this agent | `15` |
| Payments | Total payment count (all time) | `42` |

### Sorting

Agents are sorted by monthly collection amount (highest first).

### Use Case

The COO wants to identify top-performing and underperforming agents. They open Collections and see:
- **Brian** collected UGX 2.3M this month with 42 payments — top performer
- **Sarah** collected UGX 50K with only 2 payments — needs follow-up or may be inactive

---

## 11. Withdrawal Approvals

This sub-view renders **two** approval components stacked vertically:

### 11.1 Final Withdrawal Approvals (COO) — Wallet Withdrawals

**Component:** `COOWithdrawalApprovals` (`src/components/coo/COOWithdrawalApprovals.tsx`)

#### Approval Flow

```
User requests withdrawal → CFO reviews & approves → COO gives final approval
```

The COO only sees withdrawals with `status = 'cfo_approved'` — meaning the CFO has already verified the request.

#### Card Display (per request)

Each withdrawal request card shows:
- **User avatar** and name (from profiles)
- **Phone number**
- **Amount** (bold, large text, e.g., `UGX 500,000`)
- **Mobile money details** — provider (MTN/Airtel, color-coded), phone number, registered name
- **CFO approval timestamp** — "CFO approved 2 hours ago"
- **Action buttons:** Reject (red outline) | Approve & Pay (green)

#### Approve Flow

When "Approve & Pay" is clicked, a dialog appears requiring:

1. **Transaction ID (from MoMo)** — mandatory text field (e.g., `TXN123456789`)
2. **Transaction Time** — mandatory datetime picker ("Enter the exact time from the MoMo payment SMS")

Both fields are required before the "Approve & Confirm Payment" button becomes active.

**Backend action on approve:**
```sql
UPDATE withdrawal_requests SET
  status = 'approved',
  coo_approved_at = NOW(),
  coo_approved_by = <coo_user_id>,
  processed_by = <coo_user_id>,
  processed_at = NOW(),
  transaction_id = '<momo_txn_id>',
  transaction_time = '<time_from_sms>'
WHERE id = <request_id>;
```

Setting `status = 'approved'` triggers the wallet deduction (backend trigger/function).

#### Reject Flow

When "Reject" is clicked, a dialog appears with a textarea for the rejection reason (required).

**Backend action on reject:**
```sql
UPDATE withdrawal_requests SET
  status = 'rejected',
  processed_by = <coo_user_id>,
  processed_at = NOW(),
  rejection_reason = '<reason>'
WHERE id = <request_id>;
```

#### Use Case

A tenant requests UGX 200,000 withdrawal. The CFO verifies the wallet balance and approves. The COO receives the request, sees the MoMo details (MTN, 0772123456, "JOHN DOE"), sends the money via MoMo manually, then enters the transaction ID and time from the MoMo confirmation SMS to complete the approval.

---

### 11.2 Operations Clearance — Partner Withdrawals

**Component:** `COOPartnerWithdrawalApprovals` (`src/components/coo/COOPartnerWithdrawalApprovals.tsx`)

#### Approval Flow (Partner Capital)

```
Partner requests withdrawal → Partner Ops reviews → COO clears → CFO/Treasury pays out
```

The COO only sees requests with `status = 'partner_ops_approved'`.

#### Card Display

Each request card shows:
- **Partner avatar** and name
- **Phone number**
- **Amount** (bold)
- **Withdrawal reason** (italic, if provided)
- **Partner Ops review timestamp** — "Portfolio reviewed 3 hours ago"
- **Track button** — expands to show `WithdrawalStepTracker` (visual step progress)
- **Action buttons:** Reject | Clear

#### Approve (Clear) Flow

Dialog: "Grant Operations Clearance?" → "Forward UGX X for [Name] to Treasury for payout."

**Backend action:**
```sql
UPDATE investment_withdrawal_requests SET
  status = 'coo_approved',
  coo_approved_at = NOW(),
  coo_approved_by = <coo_user_id>
WHERE id = <request_id>;
```

Plus an audit log entry:
```sql
INSERT INTO audit_logs (user_id, action_type, record_id, table_name, metadata)
VALUES (<coo_id>, 'partner_withdrawal_operations_clearance_approved', <req_id>, 
        'investment_withdrawal_requests', { amount, partner_user_id });
```

#### Reject Flow

Requires minimum 10 characters rejection reason. Also creates an audit log with `partner_withdrawal_operations_clearance_rejected`.

#### Difference from Wallet Withdrawals

| Aspect | Wallet Withdrawals | Partner Withdrawals |
|---|---|---|
| Table | `withdrawal_requests` | `investment_withdrawal_requests` |
| Incoming status | `cfo_approved` | `partner_ops_approved` |
| COO action | Final approval (triggers payment) | Operational clearance (forwards to Treasury) |
| MoMo details required | Yes (Transaction ID + Time) | No |
| Next step after COO | Payment complete | CFO/Treasury processes payout |

#### Withdrawal Step Tracker

When "Track" is expanded on a partner withdrawal, a visual step tracker shows the request's journey:
- Step 1: Requested
- Step 2: Partner Ops Review
- Step 3: COO Clearance (current step)
- Step 4: Treasury Payout

---

## 12. Agent Activity

**Component:** `CashoutAgentActivity` (from `src/components/cfo/CashoutAgentActivity.tsx`)

Shows real-time agent cashout activity — agents who have submitted float withdrawal requests (paying landlords with cash collected from tenants). This gives the COO visibility into field operations happening in real time.

---

## 13. Payment Analytics

**Component:** `PaymentModeAnalytics` (`src/components/coo/PaymentModeAnalytics.tsx`)

### What It Does

Renders a **donut chart** (Recharts `PieChart` with `innerRadius`) showing the distribution of payment methods used in agent collections.

### Data Source

Queries `agent_collections` table, selecting `payment_method` and `amount` for all records.

### Payment Method Labels

| Raw Value | Display Label |
|---|---|
| `mobile_money_mtn` | MTN MoMo |
| `mobile_money_airtel` | Airtel Money |
| `cash` | Cash |
| `wallet` | Wallet |
| `mobile_money` | Mobile Money |
| Other | Capitalized with underscores replaced by spaces |

### Chart Features

- **Donut chart** (outer radius 90, inner radius 45)
- **Labels** showing name and percentage (e.g., "MTN MoMo 62%")
- **Tooltip** showing UGX formatted amount on hover
- **Legend** at bottom with circular color indicators
- **5 color palette:** Primary, Amber, Emerald, Indigo, Pink

### Use Case

The COO wants to understand collection patterns:
- If 80% is MTN MoMo, the platform is heavily dependent on MTN — diversification needed
- If Cash is growing, it may indicate MoMo issues in certain areas or agent behavior patterns
- If Wallet payments increase, it means tenants are using the platform's built-in wallet more

---

## 14. Partners Management

**Component:** `COOPartnersPage` (`src/components/coo/COOPartnersPage.tsx`)

This is the **most complex sub-view** in the COO dashboard. It's a comprehensive partner (supporter/investor) management system spanning ~2,865 lines of code.

### 14.1 Summary Cards

Four KPI cards at the top:

| Card | Value | Calculation |
|---|---|---|
| Total Partners | Count of users with `supporter` role | From `user_roles` table |
| Total Funded | Sum of all portfolio `investment_amount` | From `investor_portfolios` |
| Total Wallet Balance | Sum of all partner wallet balances | From `wallets` table |
| Avg ROI | Average ROI percentage across partners | Calculated client-side |

### 14.2 Partner Table

A full-featured data table with:

**Columns:** Name, Phone, Email, Status (active/suspended), Wallet Balance, Total Funded, Active Deals, Avg Deal Size, ROI %, Payout Day, ROI Mode, Joined Date

**Filtering:**
- Text search (name, phone, email)
- Status filter (all / active / suspended)
- ROI Mode filter (all / monthly_payout / monthly_compounding)
- Contact filter (all / has phone / no phone / has email / no email)
- Payout date range filter

**Sorting:** Any column, ascending/descending/none

**Pagination:** 15 rows per page, client-side

**Export:** CSV download of all data

### 14.3 Partner Actions (Per Row)

Via a dropdown menu (⋯ button):

1. **View Details** — Opens partner detail view
2. **Edit Partner** — Edit name, phone, ROI %, ROI mode
3. **Invest** — Add funds to partner's portfolio (minimum UGX 50,000)
4. **Suspend/Reactivate** — Toggle partner freeze status
5. **Delete Partner** — Requires confirmation reason

### 14.4 Partner Detail View

Clicking a partner opens a detailed view showing:

- **Profile info** (name, phone, joined date, freeze status)
- **Financial summary** (wallet balance, total funded, total deals, total ROI earned)
- **Portfolios list** — each portfolio with:
  - Portfolio code, account name
  - Investment amount, ROI %, payout day, status
  - Duration, maturity date, next ROI date
  - Total ROI earned
  - Actions: Edit, Rename, Renew, Fund (top-up), Transfer from Wallet, Delete
  - PDF download and WhatsApp share per portfolio
  - Inline next payout date editing

### 14.5 Nearing Payouts Dialog

A dedicated dialog showing all portfolios with ROI payouts due within the next 30 days. Features:
- Filter for portfolios with payout on the 1st of every month
- Batch processing — mark as "Compounded" or "Paid"
- Local snapshot during session (items remain visible with ✓ checkmark after processing)

### 14.6 Bulk Activate

A button to bulk-activate all portfolios with `status = 'pending_approval'`.

### 14.7 Import Partners

**Component:** `PartnerImportDialog` (`src/components/coo/PartnerImportDialog.tsx`)

A multi-step dialog for bulk importing partners from Excel:

**Step 1: Upload**
- Drag-and-drop or click to select .xlsx file (max 500 rows)
- Download template button
- Flexible header recognition (e.g., "Supporter Name", "Principal (UGX)", "Rate")

**Step 2: Preview**
- Summary cards: New Partners, Portfolios, Existing (duplicates), Errors
- Grouped by partner (same phone = same partner, multiple portfolios)
- Color-coded: green (valid), amber (existing/duplicate), red (errors)

**Step 3: Confirm**
- Final review with total amount and partner count
- COO confirmation required (shield icon)

**Step 4: Processing**
- Calls `import-partners` edge function
- Creates user accounts, assigns `supporter` role, creates portfolios

**Step 5: Results**
- Shows: Partners created, Portfolios created, Skipped duplicates, Errors

**Template columns:** Partner Name, Phone, Email, Investment Amount, Contribution Date, ROI %, Duration (Months), ROI Mode

### 14.8 Update Contribution Dates

**Component:** `UpdateContributionDatesDialog` (`src/components/coo/UpdateContributionDatesDialog.tsx`)

A specialized tool for bulk-correcting portfolio contribution dates:

**Step 1: Upload** — Excel file with 3 columns: Partner Name, Investment Amount, Contribution Date

**Step 2: Preview** — Matches uploaded rows to existing portfolios by name + amount. Shows:
- Matched count (green badge)
- Unmatched count (amber badge)
- Editable date pickers for each matched row

**Save action:** For each matched portfolio, updates:
- `created_at` → new date (UTC midday format to prevent timezone issues)
- `payout_day` → day of new date (max 28)
- `next_roi_date` → new date + 1 month
- `maturity_date` → new date + duration months

### Relationship to Dashboard

The Partners page is where the COO manages the platform's funding base. Partner capital funds tenant rent requests. Without healthy partner portfolios, the platform cannot approve new rent requests.

---

## 15. Financial Reports

**Component:** `FinancialReportsPanel` (`src/components/coo/FinancialReportsPanel.tsx`)

### Report Types

| Report | Data Source | Time Range | Filename | Columns |
|---|---|---|---|---|
| **Daily Revenue** | `general_ledger` | Today (start of day → now) | `daily-revenue-2026-04-03.csv` | Date, Reference, Category, Direction, Amount, Linked Party, Description, Account |
| **Weekly Collection** | `general_ledger` | Start of week (Monday) → now | `weekly-collections-2026-04-03.csv` | Same as above |
| **Monthly Financial Summary** | `general_ledger` | Start of month → now | `monthly-summary-2026-04.csv` | Same as above |
| **Agent Payment Report** | `agent_collections` | Last 30 days | `agent-payments-2026-04-03.csv` | Date, Agent ID, Tenant ID, Amount, Payment Method, Location, MoMo Provider, MoMo Phone |

### Use Case

End of month: COO downloads the Monthly Financial Summary CSV, opens it in Excel, creates a pivot table by category to see rent_repayment vs. fee_income vs. interest_income. Shares with board members.

---

## 16. Risk & Alerts

**Component:** `FinancialAlertsPanel` (`src/components/coo/FinancialAlertsPanel.tsx`)

### Alert Types

#### Large Payments

- **Source:** `general_ledger` where `amount > 2,000,000 UGX` in last 7 days
- **Severity:** Warning if amount > 2M, **Critical** if amount > 5M
- **Display:** "Large payment: UGX 7,500,000" — "rent repayment — John Doe"
- **Icon:** AlertTriangle (amber for warning, red for critical)

#### Failed Withdrawals

- **Source:** `withdrawal_requests` where `status = 'failed'` in last 7 days
- **Severity:** Warning
- **Display:** "Failed withdrawal: UGX 200,000" — "Transaction failed — review required"
- **Icon:** Repeat (amber)

### Alert Card UI

Each alert shows:
- Icon (color-coded by severity)
- Title and detail text
- Date (e.g., "Apr 2")
- Border color: red for critical, amber for warning

### Empty State

When no alerts: "✅ No financial anomalies detected"

### Use Case

The COO sees a critical alert: "Large payment: UGX 7,500,000 — rent repayment — Unknown." This is suspicious because no single rent payment should be that large. The COO investigates by going to Transactions, searching for the amount, and checking if it was a legitimate transaction or a data entry error.

---

## 17. Partner Top-ups

**Component:** `PendingPortfolioTopUps` (from `src/components/cfo/PendingPortfolioTopUps.tsx`)

Displays pending portfolio top-up requests — when existing partners add more capital to their investment portfolios. The COO can verify and process these top-ups.

### Relationship

Top-ups flow: Partner → requests top-up → appears in this queue → COO/CFO verifies → portfolio amount increases.

---

## 18. Staff Performance

**Component:** `StaffPerformancePanel` (from `src/components/executive/StaffPerformancePanel.tsx`)

Provides metrics on team members' activity and performance, including:
- Login frequency
- Actions performed
- Response times on approval queues

---

## 19. Recruit Supporter

**Component:** `ShareSupporterRecruit` (`src/components/shared/ShareSupporterRecruit.tsx`)

A button ("Recruit Supporter") that opens a dialog to generate and share a referral link.

### How It Works

1. Gets current user's UUID
2. Builds a URL: `https://welilereceipts-com.lovable.app/auth?role=supporter&ref=<user_id>`
3. Provides two sharing options:
   - **Copy Link** — copies to clipboard
   - **Share** — uses Web Share API (native share sheet on mobile) or falls back to WhatsApp

### Security

- Only `supporter` role is hardcoded in the URL
- `ref` parameter is validated as UUID format before building link
- Server-side signup validates the role parameter independently

### Use Case

The COO meets a potential investor at a meeting. They tap "Recruit Supporter," share the link via WhatsApp, and the investor signs up directly with the supporter role and a referral connection to the COO.

---

## 20. Summary Panels (Overview Page)

The overview page bottom section shows two panels side-by-side:

### 20.1 Payment Mode Analytics
See [Section 13](#13-payment-analytics) — same component rendered inline.

### 20.2 Financial Alerts
See [Section 16](#16-risk--alerts) — same component rendered inline.

These provide at-a-glance operational intelligence without requiring navigation.

---

## 21. Legacy COO Dashboard

**Component:** `COODashboard` (`src/pages/COODashboard.tsx`)
**Route:** `/coo-dashboard`

This is the **original** COO dashboard before the refactor. It still exists as a legacy route and provides a different view:

### Features

- **9 KPI Tile Cards** with health status indicators (green/yellow/red):
  1. Active Users (7d)
  2. Earning Agents (7d)
  3. Tenants With Balances
  4. New Rent Requests (today / week) — with drill-down showing recent request details
  5. Active Partners
  6. New Partner Requests
  7. Active Landlords
  8. Landlords in Pipeline
  9. Rent Coverage (Safe/Tight/Dangerous)

- **Guidance Alerts** — automated operational recommendations:
  - 🚨 "Pause new rent approvals. Fix cash flow." (red coverage)
  - ⚠️ "Growth pressure detected. Monitor closely." (yellow coverage)
  - ⚠️ "No agents earning. Operational issue suspected." (zero agents)
  - ⚠️ "Landlord pipeline empty." (zero landlords)
  - ✅ "All systems operational. Safe to grow." (all healthy)

- **Withdrawal Approvals** — same `COOWithdrawalApprovals` and `COOPartnerWithdrawalApprovals` components

### Tile Card Interactivity

Each tile card has a status dot:
- **Green:** Solid green dot
- **Yellow:** Solid amber dot
- **Red:** Solid red dot with **pinging animation** (draws immediate attention)

Red-status tiles also display an "ACTION REQUIRED" badge.

### Relationship to Current Dashboard

The legacy dashboard at `/coo-dashboard` now redirects to the same component as `/coo/dashboard`. However, the standalone `COODashboard` component at `src/pages/COODashboard.tsx` may still be referenced from certain navigation paths (e.g., `COODetailLayout` back button navigates to `/coo-dashboard`).

---

## 22. COO Detail Layout & Shared Components

**Component:** `COODetailLayout` (`src/components/coo/COODetailLayout.tsx`)

A reusable layout wrapper for COO detail/drill-down pages.

### Features

- **Sticky header** with back button (navigates to `/coo-dashboard`)
- **Title** with health status dot (green/yellow/red)
- **Subtitle** in uppercase tracking
- **MobileBottomNav** integration

### Exported Helper Components

#### `KPICard`
```tsx
<KPICard label="Active Users" value={42} sub="Last 7 days" status="green" />
```
Renders a 2xl bold number with label and optional subtitle, color-coded by health status.

#### `SectionTitle`
```tsx
<SectionTitle>Agent Performance</SectionTitle>
```
Uppercase tracking text for section headers.

#### `DataRow`
```tsx
<DataRow label="Total Revenue" value="UGX 12,000,000" highlight />
```
A flex row with label and value, optionally highlighted in emerald.

---

## 23. Data Table Component (COODataTable)

**Component:** `COODataTable` (`src/components/coo/COODataTable.tsx`)

A generic, reusable data table used across COO pages. Not currently used in the main dashboard sub-views directly, but available for any tabular data display.

### Features

| Feature | Detail |
|---|---|
| **Search** | Real-time text filtering across all visible columns |
| **Sorting** | Click column headers to cycle: unsorted → ascending → descending → unsorted |
| **Pagination** | Client-side, configurable page size (default 15) |
| **CSV Export** | One-click export of all data |
| **Row Detail Drawer** | Click any row to open a bottom drawer showing all fields (including `detailOnly` columns) |
| **Responsive** | Horizontal scroll on mobile with minimum column widths |
| **Zebra striping** | Alternating row backgrounds for readability |
| **Record count** | Footer showing total/filtered count |

### Column Configuration

```typescript
interface COOColumn<T> {
  key: string;           // Data field key
  label: string;         // Display header
  render?: (row: T) => ReactNode;  // Custom render function
  align?: 'left' | 'right' | 'center';
  detailOnly?: boolean;  // Only shown in detail drawer, not in table
  sortable?: boolean;    // Default true
}
```

---

## 24. Mobile Responsiveness

The COO dashboard is designed mobile-first:

### Quick Nav Grid
- **Mobile (< 640px):** 2-column grid
- **Tablet (640-1023px):** 3-column grid
- **Desktop (≥ 1024px):** 4-column grid

### Sub-view Navigation
- **Mobile:** "Back to Overview" button appears above each sub-view
- **Desktop:** Sidebar navigation always visible

### KPI Cards
- **Mobile:** 2-column grid, smaller text
- **Desktop:** 4-column grid, larger text

### Touch Optimization
- All interactive elements have minimum 44px touch targets
- `active:scale-[0.97]` feedback on tap
- `touch-manipulation` CSS for immediate tap response

### Financial Command Center
- Primary actions (Verify Deposits, Withdrawals) use large buttons
- Secondary tools in bottom sheet (swipe up to access)

---

## 25. Relationships & Data Flow

### Money Flow Through COO Dashboard

```
Tenants pay rent
    ↓
Agents collect via MoMo/Cash
    ↓ (agent_collections table)
Collections appear in "Agent Collections" view
    ↓
Ledger entries created (general_ledger table)
    ↓
"Financial Metrics" KPIs update
    ↓
Partner capital funds new rent requests
    ↓ (investor_portfolios table)
"Partners" view shows portfolio health
    ↓
Withdrawal requests flow through multi-stage approval
    ↓
COO approves in "Withdrawals" view
    ↓
Money deducted from wallets (wallets table)
```

### Approval Chain Dependencies

```
Rent Approval:     Landlord Ops → COO → CFO
Wallet Withdrawal: User → CFO → COO (final)
Partner Withdrawal: User → Partner Ops → COO → Treasury/CFO
```

### Cross-Dashboard References

| COO Component | Also Used In |
|---|---|
| `RentPipelineQueue` | CEO Dashboard, Tenant Ops |
| `CashoutAgentActivity` | CFO Dashboard |
| `PendingPortfolioTopUps` | CFO Dashboard |
| `StaffPerformancePanel` | CEO Dashboard |
| `FinancialOpsCommandCenter` | Financial Ops page (`/admin/financial-ops`) |
| `ShareSupporterRecruit` | Manager Dashboard |

### Tables Directly Queried

| Table | Used By | Purpose |
|---|---|---|
| `general_ledger` | FinancialMetricsCards, Transactions, Reports, Alerts | All financial entries |
| `agent_collections` | AgentCollections, PaymentAnalytics, Reports | Agent collection records |
| `wallets` | FinancialMetricsCards | User wallet balances |
| `withdrawal_requests` | FinancialMetricsCards, COOWithdrawalApprovals | Withdrawal processing |
| `investment_withdrawal_requests` | COOPartnerWithdrawalApprovals | Partner capital withdrawals |
| `investor_portfolios` | COOPartnersPage | Partner investment portfolios |
| `user_roles` | COOPartnersPage | Role-based partner identification |
| `profiles` | Multiple components | User names, phones, avatars |
| `agent_visits` | AgentCollections | Agent field visit records |
| `agent_float_limits` | WalletMonitoringPanel | Agent float configuration |
| `audit_logs` | COOPartnerWithdrawalApprovals | Audit trail |

---

## Appendix: File Map

| File Path | Component | Lines |
|---|---|---|
| `src/pages/coo/Dashboard.tsx` | COODashboardPage (primary) | 236 |
| `src/pages/COODashboard.tsx` | COODashboard (legacy) | 414 |
| `src/components/coo/FinancialMetricsCards.tsx` | KPI tiles | 97 |
| `src/components/coo/FinancialTransactionsTable.tsx` | Ledger explorer | 185 |
| `src/components/coo/AgentCollectionsOverview.tsx` | Agent performance | 118 |
| `src/components/coo/COOWithdrawalApprovals.tsx` | Wallet withdrawal approvals | 324 |
| `src/components/coo/COOPartnerWithdrawalApprovals.tsx` | Partner withdrawal clearance | 298 |
| `src/components/coo/PaymentModeAnalytics.tsx` | Payment method chart | 88 |
| `src/components/coo/FinancialReportsPanel.tsx` | CSV report generators | 114 |
| `src/components/coo/FinancialAlertsPanel.tsx` | Risk detection | 120 |
| `src/components/coo/COOPartnersPage.tsx` | Partner management suite | 2,865 |
| `src/components/coo/PartnerImportDialog.tsx` | Bulk partner import | 530 |
| `src/components/coo/UpdateContributionDatesDialog.tsx` | Bulk date corrections | 322 |
| `src/components/coo/COODetailLayout.tsx` | Detail page layout | 72 |
| `src/components/coo/COODataTable.tsx` | Reusable data table | 283 |
| `src/components/coo/WalletMonitoringPanel.tsx` | Wallet liquidity overview | 72 |
| `src/components/shared/ShareSupporterRecruit.tsx` | Referral link generator | 129 |

---

*End of COO Dashboard Documentation v1.0*
