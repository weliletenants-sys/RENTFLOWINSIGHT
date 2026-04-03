# Welile Funder (Supporter) Dashboard — Comprehensive Documentation v3.0

> **Last Updated:** 2026-04-03  
> **Audience:** Internal agents, support staff, developers, operations managers  
> **Platform Role Name:** `supporter` (internally referred to as "Funder" in business context)

---

## Table of Contents

1. [Overview & Architecture](#1-overview--architecture)
2. [Onboarding Flow](#2-onboarding-flow)
3. [Supporter Agreement System](#3-supporter-agreement-system)
4. [Dashboard Layout & UI Structure](#4-dashboard-layout--ui-structure)
5. [Portfolio Summary Card (Hero Card)](#5-portfolio-summary-card-hero-card)
6. [Quick Actions Bar](#6-quick-actions-bar)
7. [Capital Opportunities Module](#7-capital-opportunities-module)
8. [Virtual Houses Feed](#8-virtual-houses-feed)
9. [Menu Drawer & Navigation](#9-menu-drawer--navigation)
10. [Wallet System](#10-wallet-system)
11. [Investment Portfolio Page](#11-investment-portfolio-page)
12. [Investment Calculator](#12-investment-calculator)
13. [Supporter Earnings & ROI Analytics](#13-supporter-earnings--roi-analytics)
14. [Deposit & Funding Flow](#14-deposit--funding-flow)
15. [Investment Withdrawal Flow](#15-investment-withdrawal-flow)
16. [Notification System](#16-notification-system)
17. [Referral & Invite System](#17-referral--invite-system)
18. [Verification Checklist](#18-verification-checklist)
19. [Merchant Code Pills](#19-merchant-code-pills)
20. [Angel Pool Investment](#20-angel-pool-investment)
21. [Financial Statement](#21-financial-statement)
22. [Funder Portfolio Card (Agent View)](#22-funder-portfolio-card-agent-view)
23. [Backend Architecture](#23-backend-architecture)
24. [Database Tables Reference](#24-database-tables-reference)
25. [Edge Functions Reference](#25-edge-functions-reference)
26. [Security & RLS](#26-security--rls)

---

## 1. Overview & Architecture

### What is the Funder Dashboard?

The Funder (Supporter) Dashboard is the primary interface for users who invest capital into the Welile rent financing ecosystem. Funders deposit money, which is deployed to pay rent on behalf of tenants. In return, funders earn **15% monthly returns** on their deployed capital.

### Architecture Pattern

- **Component:** `SupporterDashboard.tsx` (571 lines)
- **Location:** `src/components/dashboards/SupporterDashboard.tsx`
- **Lazy Loaded:** Yes — loaded via `React.lazy()` in `Dashboard.tsx`
- **Role Guard:** Only accessible when `currentRole === 'supporter'`
- **Offline Support:** Local-first with `localStorage` caching of houses, contributions, and portfolio data
- **PWA:** Full PWA support with `manifest.webmanifest` — app installs as "Welile.com"

### Key Design Principles

| Principle | Implementation |
|---|---|
| Mobile-first | `max-w-lg mx-auto`, touch targets ≥ 44px, `touch-manipulation` |
| Local-first | `localStorage` cache with 10-minute TTL for houses |
| Agreement-gated | All investment actions locked behind `SupporterAgreementModal` |
| Haptic feedback | `hapticTap()` / `hapticSuccess()` on every interactive element |
| Skeleton loading | `SupporterDashboardSkeleton` shown during initial load |

### State Management

```
SupporterDashboard
├── useAuth()           → user, role, signOut
├── useProfile()        → profile (name, avatar, verified status)
├── useWallet()         → wallet.balance, refreshWallet()
├── useSupporterAgreement() → hasAccepted, acceptance, acceptAgreement()
├── useConfetti()       → fireSuccess(), fireFirstFunding()
├── useState: virtualHouses[]      (cached from localStorage)
├── useState: totalRentContributed (from investor_portfolios)
├── useState: totalRoiEarned       (calculated monthly return)
└── useState: menuOpen, showWallet, showCalculator, etc.
```

---

## 2. Onboarding Flow

### Route: `/become-supporter`
**Component:** `BecomeSupporter.tsx` (487 lines)

### Sign-Up Process

1. User navigates to `/become-supporter` (direct or via referral link `/become-supporter?ref=USER_ID`)
2. Page displays 3 benefit cards:
   - **15% Monthly Returns** — "Earn interest on your investments"
   - **Flexible Withdrawals** — "Access your funds anytime"
   - **Help Tenants** — "Support people with rent payments"
3. User fills: Full Name, Phone Number, Password
4. **Phone Duplicate Check:** `usePhoneDuplicateCheck(phone, 400)` — real-time debounced check against existing accounts
5. On submit:
   - Calls `signUpWithoutRole()` (creates auth account without role)
   - Then calls `addRole('supporter')` to assign the supporter role
   - Records referral if `ref` param present (stored in `localStorage` as `supporter_referrer_id`)
6. Redirects to `/dashboard` with supporter role active

### Sign-In (Existing Users)

- Phone-based login (phone → email lookup → sign in)
- After login, if user doesn't have `supporter` role, calls `addRole('supporter')`

### Referral Tracking

```
URL: /become-supporter?ref=USER_ID
↓
localStorage.setItem('supporter_referrer_id', USER_ID)
↓
On signup: referral recorded in profiles table
↓
Referrer name displayed: "Invited by {name}"
```

### Short Link Support

- `/join?s=USER_ID` → redirects to `/become-supporter?ref=USER_ID`
- Session storage backup for mobile browser URL param loss

---

## 3. Supporter Agreement System

### Purpose

All investment actions are **gated** behind a legal agreement. Until the supporter accepts, the dashboard shows a `LockedOverlay` over the opportunities section.

### Components

| Component | File | Purpose |
|---|---|---|
| `SupporterAgreementModal` | `agreement/SupporterAgreementModal.tsx` | Full-screen modal with terms |
| `LockedOverlay` | `agreement/LockedOverlay.tsx` | Overlay blocking opportunities |
| `AgreementAcceptedBadge` | `agreement/AgreementAcceptedBadge.tsx` | Green badge shown after acceptance |
| `SupporterAgreementBanner` | `agreement/SupporterAgreementBanner.tsx` | Top banner prompting review |
| `SupporterAgreementViewModal` | `agreement/SupporterAgreementCard.tsx` | Read-only view of signed terms |

### Flow

```
Dashboard Load → useSupporterAgreement()
├── hasAccepted === false → Show SupporterAgreementModal
├── User clicks "Accept" → acceptAgreement() → DB write
├── localHasAccepted = true (instant UI update)
├── Toast: "🎉 Welcome to Welile Supporters!"
├── Edge Function: send-supporter-agreement-email (async)
└── justAccepted → celebration animation (5s)
```

### Agreement State

- **Hook:** `useSupporterAgreement()`
- **Table:** `supporter_agreements` (stores `user_id`, `accepted_at`, `version`)
- **Effective State:** `effectiveHasAccepted = localHasAccepted === true || hasAccepted === true`

### UI Behavior When Not Accepted

- Greeting bar shows orange "Terms" button instead of green badge
- `LockedOverlay` covers the Capital Opportunities section
- Quick action "Add Funds" redirects to agreement modal
- Menu drawer items that involve investment show locked state

---

## 4. Dashboard Layout & UI Structure

### Visual Hierarchy (Top to Bottom)

```
┌──────────────────────────────────┐
│  DashboardHeader                 │ ← Role indicator, NotificationBell
├──────────────────────────────────┤
│  Greeting Bar                    │ ← Avatar, name, verified badge, AI ID
│  VerificationChecklist           │ ← Compact progress indicator
│  MerchantCodePills              │ ← MTN 090777, Airtel 4380664
├──────────────────────────────────┤
│  PortfolioSummaryCards (Hero)    │ ← Dark gradient card with balance
├──────────────────────────────────┤
│  Quick Actions [Add Funds][ROI][☰]│ ← 3 pill buttons
├──────────────────────────────────┤
│  Capital Opportunities           │ ← FunderCapitalOpportunities
│  (Locked if agreement not signed)│
├──────────────────────────────────┤
│  My Houses (Collapsible)         │ ← VirtualHousesFeed
├──────────────────────────────────┤
│  InviteAndEarnCard              │ ← Referral card
├──────────────────────────────────┤
│  MobileBottomNav                 │ ← Fixed bottom navigation
└──────────────────────────────────┘
```

### Responsive Breakpoints

- **Mobile (< 640px):** Single column, `px-3`, compact stats
- **Tablet (640px+):** `px-4`, slightly larger typography
- **Desktop:** `max-w-lg mx-auto` constrains width for readability

### Key CSS

- Container: `h-dvh bg-background flex flex-col overflow-hidden`
- Scroll area: `flex-1 min-h-0 overflow-y-auto pb-28 overscroll-contain`
- Main content: `px-3 xs:px-4 py-4 xs:py-5 space-y-5 max-w-lg mx-auto`

---

## 5. Portfolio Summary Card (Hero Card)

### Component: `PortfolioSummaryCards`
**File:** `src/components/supporter/PortfolioSummaryCards.tsx` (136 lines)

### Visual Design

A dark glass-morphism card with gradient background:
```css
.portfolio-hero-card {
  /* Dark purple/primary gradient */
  /* Decorative circles with bg-white/[0.06] */
  /* Horizontal divider line with bg-white/10 */
}
```

### Data Displayed

| Metric | Source | Tap Action |
|---|---|---|
| **Available Balance** | `wallet.balance` via `useWallet()` | Opens `FullScreenWalletSheet` |
| **+{amount}/mo** | `totalReturn` (ROI from portfolios) | — |
| **Houses** | Count of `virtualHouses` or calculated from `rentSecured / 300,000` | — |
| **Return/mo** | `totalReturn` formatted compact | — |
| **Deployed** | `rentSecured` (total from `investor_portfolios`) | Opens `InvestmentBreakdownSheet` |

### Props Interface

```typescript
interface PortfolioSummaryCardsProps {
  housesFunded: number;       // from virtualHouses.length
  rentSecured: number;        // from totalRentContributed
  walletBalance?: number;     // from wallet.balance
  portfolioHealth: 'stable' | 'at_risk' | 'growing';
  totalReturn?: number;       // monthly ROI estimate
}
```

### Portfolio Health Calculation

```typescript
const portfolioHealth = (() => {
  if (virtualHouses.length === 0) return 'stable';
  const redCount = virtualHouses.filter(h => h.paymentHealth === 'red').length;
  if (redCount > 0) return 'at_risk';
  const greenRatio = virtualHouses.filter(h => h.paymentHealth === 'green').length / virtualHouses.length;
  return greenRatio >= 0.8 ? 'growing' : 'stable';
})();
```

### Active Pulse Indicator

Top-right corner shows a green pulsing dot with "Active" label:
```html
<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
```

---

## 6. Quick Actions Bar

### Layout: 3 Pill Buttons in a Row

```
[  💳 Add Funds  ] [  📊 ROI  ] [  ☰  ]
   (primary bg)      (bordered)   (bordered)
```

### Button Behaviors

| Button | Style | Action |
|---|---|---|
| **Add Funds** | `bg-primary text-primary-foreground` | Opens `PaymentPartnersDialog` (if agreement accepted) or agreement modal |
| **ROI** | `bg-card border-2 border-border/60` | Opens `InvestmentCalculator` in dialog |
| **Menu (☰)** | `bg-card border-2 border-border/60` | Opens `SupporterMenuDrawer` |

### Touch Specs

- Min height: `48px` (`min-h-[48px]`)
- Active state: `active:scale-[0.96]`
- Transition: `transition-transform touch-manipulation`

---

## 7. Capital Opportunities Module

### Component: `FunderCapitalOpportunities`
**File:** `src/components/supporter/FunderCapitalOpportunities.tsx` (500 lines)

### Purpose

Allows supporters to deploy capital into two investment pools:

1. **Tenant Rent Fund** — Direct rent financing (15% monthly ROI)
2. **Angel Pool** — Equity-based investment in Welile company

### View States

```typescript
type ViewState = 'default' | 'investing' | 'committed';
```

- **default:** Shows two investment cards (Tenant + Angel)
- **investing:** Shows amount input, slider, preview
- **committed:** Shows success confirmation

### Tenant Rent Fund Flow

1. Supporter selects "Tenant Rent" tab
2. Enters amount via `AmountInput` (numeric input + slider)
3. **Investment Preview** shows:
   - Investment amount
   - Monthly Return (15%)
   - Daily Return (0.5%/day)
   - Deploy Speed: 24–72hrs
   - Payout: Monthly
4. Confirm → Calls edge function or RPC
5. Wallet debited → `investor_portfolios` record created
6. Events dispatched: `supporter-contribution-changed`, `wallet-balance-changed`

### Angel Pool Flow

1. Supporter selects "Angel Pool" tab
2. Enters amount (minimum `PRICE_PER_SHARE = UGX 20,000`)
3. **Angel Preview** shows:
   - Shares purchased (`amount / 20,000`)
   - Pool ownership % (`shares / 25,000 * 100`)
   - Company ownership % (`8 / 25,000 * shares`)
   - Valuation scenarios ($1B, $3B, $5B)
4. Confirm → Writes to `angel_pool_investments` table

### Angel Pool Constants

```typescript
TOTAL_POOL_UGX = 500,000,000    // UGX 500M total pool
TOTAL_SHARES   = 25,000          // 25K shares
PRICE_PER_SHARE = 20,000         // UGX 20K per share
POOL_PERCENT   = 8               // 8% equity
UGX_PER_USD    = 3,750           // Exchange rate
```

### Backend Data Source

- **Hook:** `useCapitalOpportunities()` — fetches available deployment slots
- **Wallet:** `useWallet()` — current balance for validation
- **Table:** `investor_portfolios`, `angel_pool_investments`

---

## 8. Virtual Houses Feed

### Component: `VirtualHousesFeed`
**File:** `src/components/supporter/VirtualHousesFeed.tsx` (99 lines)

### Concept

Every rent request funded by a supporter becomes a "virtual house" in their portfolio. This gamified view gives supporters a tangible sense of their investments.

### Data Interface

```typescript
interface VirtualHouse {
  id: string;            // rent_request.id
  shortId: string;       // First 6 chars uppercase
  area: string;          // request_city
  city: string;          // request_city
  rentAmount: number;    // rent_amount
  paymentHealth: 'green' | 'amber' | 'red';
  agentManaged: boolean; // !!agent_id
  updatedAt: string;
  status: string;        // rent_request status
  durationDays: number;
}
```

### Health Color Logic

```typescript
// From rent_request.status:
'completed' | 'repaid'     → green  (✅ Good)
'funded' | 'disbursed'     → amber  (⏳ Pending)
'defaulted' | 'overdue'    → red    (⚠️ At Risk)
```

### Filter Chips

Horizontal scrollable filter bar:
- **All** — shows all houses
- **🟢 Good** — `paymentHealth === 'green'`
- **🟡 Pending** — `paymentHealth === 'amber'`
- **🔴 Risk** — `paymentHealth === 'red'`

### Virtual House Card

**Component:** `VirtualHouseCard.tsx`

Each card displays:
```
┌─────────────────────────────────┐
│  🏠 House #A1B2C3    ✅ Good   │
│  📍 Kampala, Uganda             │
│  Rent: UGX 450,000             │
│              👤 Agent Managed   │
│              ⏰ 2 days ago      │
└─────────────────────────────────┘
```

### House Details Sheet

**Component:** `VirtualHouseDetailsSheet.tsx`

Tapping a house opens a bottom sheet with:
- Full rent amount and status
- Payment timeline
- Repayment progress
- Agent assignment details

### Collapsible Section

On the dashboard, houses are wrapped in a `<Collapsible>` with:
- Trigger showing "🏘️ {count} Properties — Your funded portfolio"
- Badge showing count
- Default: open

### Caching Strategy

```typescript
// Cache key: supporter_houses_{user.id}
// TTL: 10 minutes (HOUSES_CACHE_TTL)
// Structure: { houses: VirtualHouse[], totalRent: number, timestamp: number }
// Read: synchronous in useState initializer
// Write: after successful fetch
```

---

## 9. Menu Drawer & Navigation

### Component: `SupporterMenuDrawer`
**File:** `src/components/supporter/SupporterMenuDrawer.tsx` (233 lines)

### Animation

- **Entry:** Slides from right (`x: '100%' → 0`)
- **Spring:** `damping: 28, stiffness: 320`
- **Backdrop:** `bg-black/50 backdrop-blur-[2px]`
- **Width:** `w-[82%] max-w-xs`

### Menu Sections

#### Share & Grow
| Item | Route | Description |
|---|---|---|
| Referrals | `/referrals` | Invite & earn rewards |
| Share App | `/install` | Invite friends to Welile |

#### Investments
| Item | Action | Description |
|---|---|---|
| Add Investment | Opens PaymentPartnersDialog | Fund via Mobile Money |
| ROI Analytics | `/supporter-earnings` | Earnings & projections |
| ROI Calculator | Opens InvestmentCalculator | Project your returns |

#### Finances
| Item | Route | Description |
|---|---|---|
| My Wallet | `/transactions` | Balance & transactions |
| History | `/transactions` | All payment activity |
| Statement | `/financial-statement` | Download financial statement |
| Receipts | `/my-receipts` | Payment records |

#### Community
| Item | Route | Description |
|---|---|---|
| Marketplace | `/marketplace` | Shop products |

#### Account
| Item | Route/Action | Description |
|---|---|---|
| Agreement | Opens SupporterAgreementViewModal | Terms & conditions |
| Angel Pool Agreement | `/angel-pool-agreement` | View & sign pool terms |
| Settings | `/settings` | Account preferences |
| Help | `/settings` | Get assistance |

### Special Sections in Drawer

1. **AI Credit Requests** (`CreditRequestsFeed`) — Shows automated credit requests from AI
2. **Investment Categories** (`RentCategoryFeed`) — Shows rent categories by amount range for targeted investment

---

## 10. Wallet System

### Core Hook: `useWallet()`

Returns:
```typescript
{
  wallet: { balance: number; ... } | null;
  refreshWallet: () => Promise<void>;
}
```

### Wallet Display

The wallet balance is shown in the Portfolio Summary Card. Tapping the balance opens `FullScreenWalletSheet`.

### Deposit Flow

**Dialog:** `PaymentPartnersDialog` with `dashboardType="supporter"`

Deposit channels:
- **MTN MoMo:** Merchant Code `090777`
- **Airtel Money:** Merchant Code `4380664`
- **Bank Transfer:** Equity Bank account details

### Deposit Verification

1. User sends money via MoMo/Bank
2. User submits deposit request with Transaction ID
3. TID normalized: uppercase, prefixed with `TID` or `RCT`
4. **Auto-approval:** If TID matches `pre_registered_tids` (status: 'waiting', amount within 1 UGX tolerance)
5. **Manual approval:** Enters manager verification queue in `deposit_requests`

### Wallet Sheets

| Component | Purpose |
|---|---|
| `FullScreenWalletSheet` | Full wallet view with balance, recent transactions, actions |
| `WalletBreakdown` | Breakdown of wallet composition |
| `WalletStatement` | Filterable ledger statement |
| `WalletCard` | Compact wallet card for inline display |

---

## 11. Investment Portfolio Page

### Route: `/investment-portfolio`
**Component:** `InvestmentPortfolio.tsx` (497 lines)

### Purpose

Detailed view of all investment accounts (portfolios) created by the supporter.

### Data Source

```sql
SELECT * FROM investor_portfolios
WHERE investor_id = {user.id} OR agent_id = {user.id}
AND status IN ('active', 'pending_approval')
ORDER BY created_at DESC
```

### KPI Cards (Top Section)

| Card | Value | Color | Source |
|---|---|---|---|
| **Total Portfolio Value** | Sum of all `investment_amount` | Primary gradient | `investor_portfolios` |
| **Monthly Returns** | `totalBalance * 0.15` | Success green | Calculated |
| **ROI Rate** | Fixed `15%` | Primary | Constant |

### Account Cards

Each portfolio displayed as a card:
```
┌──────────────────────────────────┐
│ 🟢 Portfolio ABC123     Active   │
│ Investment: UGX 1,500,000        │
│ ROI Earned: UGX 225,000          │
│ Duration: 6 months               │
│ ROI Mode: monthly                │
├──────────────────────────────────┤
│ [Rename]                         │
└──────────────────────────────────┘
```

### Features

- **Filter by status:** All | Active | Pending | Awaiting
- **Rename account:** Inline edit with save/cancel
- **Tap for details:** Opens detail dialog with:
  - Transaction history (`InvestmentTransactionHistory`)
  - Linked fundings
  - Interest payment history
- **Status indicators:**
  - 🟢 Active (approved)
  - 🟡 Pending/Awaiting
  - 🔴 Rejected

### Status Colors

```typescript
'approved' → 'bg-success/10 text-success border-success/20'
'pending*' → 'bg-warning/10 text-warning border-warning/20'
'rejected' → 'bg-destructive/10 text-destructive border-destructive/20'
```

---

## 12. Investment Calculator

### Component: `InvestmentCalculator`
**File:** `src/components/supporter/InvestmentCalculator.tsx` (1,178 lines)

### Purpose

A comprehensive financial calculator that projects investment returns over time. Used for both personal planning and sharing with prospects.

### Core Parameters

| Parameter | Default | Range | Description |
|---|---|---|---|
| Desired Monthly Earnings | UGX 150,000 | Adjustable | Target monthly income |
| Duration | 12 months | 1-60 months | Investment horizon |
| Compounding | Off | Toggle | Reinvest earnings |
| Reward Rate | 15% | Fixed | Monthly return rate |

### Calculation Logic

```typescript
const REWARD_RATE = 0.15; // 15% monthly

// Simple: requiredContribution = desiredEarnings / REWARD_RATE
// Compounding: Uses compound interest formula
```

### Projections

Generates `MonthlyProjection[]`:
```typescript
interface MonthlyProjection {
  month: number;
  principal: number;
  earnings: number;
  totalEarnings: number;
  balance: number;
}
```

### Visualization

- **AreaChart** (Recharts) showing principal vs. earnings over time
- **Breakdown table** with monthly details

### Scenario Management

- Save multiple scenarios to `localStorage`
- Compare scenarios side-by-side
- Each scenario gets a unique color from `SCENARIO_COLORS`

### Currency Support

- **Multi-currency:** UGX and USD via `useCurrency()` hook
- **Live exchange rates:** Refreshable with `refreshRates()`
- **Display:** `1 USD = {rate} UGX`

### Export Features

- **PDF Export:** `exportToPDF()` generates downloadable PDF
- **WhatsApp Share:** Formatted text message with breakdown
- **Comparison Export:** PDF with side-by-side scenarios

### Integration

On the dashboard, opened via:
```tsx
<Dialog open={showCalculator} onOpenChange={setShowCalculator}>
  <InvestmentCalculator />
</Dialog>
```

Also accessible from Menu Drawer → "ROI Calculator"

---

## 13. Supporter Earnings & ROI Analytics

### Route: `/supporter-earnings`
**Component:** `SupporterEarnings.tsx` (565 lines)

### Purpose

Detailed analytics page for ROI payments received and projections.

### Sections

1. **Summary Cards** — Total earned, pending, projected
2. **ROI Payment History** — Table of individual payments
3. **Monthly Chart** — Bar/area chart of earnings over time
4. **Leaderboard** — `SupporterROILeaderboard` component

### Data Source

Currently uses `investor_portfolios` data (legacy `supporter_roi_payments` and `landlord_payment_proofs` tables removed).

### ROI Leaderboard

**Component:** `SupporterROILeaderboard`

Displays top supporters by ROI earned, encouraging competition and higher investment.

---

## 14. Deposit & Funding Flow

### Deposit History Page

**Route:** `/deposit-history`
**Component:** `DepositHistory.tsx` (260 lines)

### Flow

1. User opens deposit dialog (from Quick Actions or Menu)
2. `PaymentPartnersDialog` shows:
   - MTN MoMo merchant code: **090777**
   - Airtel Money merchant code: **4380664**
   - Bank transfer details: Equity Bank
3. User makes payment externally
4. User submits deposit request:
   - Amount
   - Transaction ID (normalized: uppercase, TID/RCT prefix)
   - Transaction date (within 7-day window)
   - Optional: bank slip photo
5. System checks `pre_registered_tids`:
   - Match found → **Auto-approved** → Wallet credited instantly
   - No match → Enters manual verification queue
6. Status tracked in `deposit_requests` table

### Deposit History Card

Each deposit shows:
```
┌──────────────────────────────────┐
│ ⏳ Pending          Mar 15, 2026 │
│ Amount: UGX 500,000              │
│ Provider: MTN MoMo               │
│ TID: ••••1234                    │
│ [📥 Download Receipt] [💬 Share] │
└──────────────────────────────────┘
```

### Receipt Features

- **PDF Download:** `downloadDepositReceipt()` generates receipt PDF
- **WhatsApp Share:** `buildDepositReceiptWhatsApp()` formats receipt as message

---

## 15. Investment Withdrawal Flow

### Component: `InvestmentWithdrawButton`
**File:** `src/components/supporter/InvestmentWithdrawButton.tsx` (375 lines)

### Withdrawal Rules

- Withdrawals are from **deployed capital** (not wallet balance)
- Quick chips: 25%, 50%, 75%, 100% of deployed capital
- Minimum processing time: 90-day notice period
- Multi-step approval chain

### Approval Chain

```
Supporter submits withdrawal request
  ↓
Partner Ops reviews → partner_ops_approved_at
  ↓
COO approves → coo_approved_at
  ↓
CFO processes payout → cfo_processed_at
  ↓
Funds returned to wallet or MoMo
```

### Progress Tracking

**Component:** `WithdrawalStepTracker` shows visual progress:
```
[Submitted] → [Partner Ops ✓] → [COO ✓] → [CFO Processing]
```

### Existing Request Display

If a pending/approved request exists, the dialog shows:
- Current status with step tracker
- Amount requested
- Earliest process date
- Submission date
- No new request allowed while one is pending

### Payout Methods (via WithdrawAccountDialog)

```typescript
type PayoutMode = 'cash' | 'mtn' | 'airtel' | 'bank';
```

| Mode | Required Fields |
|---|---|
| MTN MoMo | Phone number, Account name |
| Airtel Money | Phone number, Account name |
| Bank | Bank name, Account name, Account number |
| Cash | None (collected in person) |

### Backend Table

`investment_withdrawal_requests`:
- `user_id`, `amount`, `status`, `reason`
- `earliest_process_date` (90 days from submission)
- `partner_ops_approved_at`, `coo_approved_at`, `cfo_processed_at`

---

## 16. Notification System

### Component: `NotificationBell`
**File:** `src/components/supporter/NotificationBell.tsx` (175 lines)

### Data Source

```sql
SELECT id, title, message, type, is_read, created_at, metadata
FROM notifications
WHERE user_id = {userId}
ORDER BY created_at DESC
LIMIT 50
```

### Real-time Updates

```typescript
supabase.channel(`notif-bell-${userId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`,
  }, (payload) => {
    setNotifications(prev => [payload.new, ...prev]);
  })
  .subscribe()
```

### Notification Types

| Type | Icon | Color | Example |
|---|---|---|---|
| `success` | ✅ CheckCircle2 | Emerald | "Deposit approved" |
| `investment` | 📈 TrendingUp | Primary | "Portfolio deployed" |
| `reward` | 🎁 Gift | Amber | "ROI payment credited" |
| `warning` | ⚠️ AlertTriangle | Amber | "Payment overdue" |
| `info` | ℹ️ Info | Blue | "New feature available" |
| `welcome` | 🔔 Bell | Primary | "Welcome to Welile!" |

### UI

- **Bell icon** in header with unread count badge
- **Popover** for quick view (recent 5)
- **Full modal** (`NotificationsModal`) for all notifications
- **Mark as read** functionality

---

## 17. Referral & Invite System

### Components

| Component | Purpose |
|---|---|
| `InviteAndEarnCard` | Compact referral card on dashboard |
| `ModernInviteCard` | Full invite card with calculator sharing |
| `ShareSupporterLink` | Share supporter referral link |
| `ShareCalculatorLink` | Share calculator link (auto-assigns supporter role) |
| `SupporterReferralStats` | Stats on referral performance |

### Referral Link Formats

```
Supporter Invite: /become-supporter?ref={USER_ID}
Calculator Share: /calculator?ref={USER_ID}
General Referral: /join?r={USER_ID}
Short Link:       /join?s={USER_ID} → /become-supporter
```

### Referrals Page

**Route:** `/referrals`
**Component:** `Referrals.tsx` (274 lines)

Features:
- Referral link copy/share
- Referral count and list
- `ReferralLeaderboard` — platform-wide ranking
- `RewardHistoryBadges` — earned reward badges

---

## 18. Verification Checklist

### Component: `VerificationChecklist`
**File:** `src/components/shared/VerificationChecklist.tsx`

Compact inline checklist showing profile completion:
- ✅ Phone verified
- ✅ Email added
- ✅ ID uploaded
- ✅ Agreement signed

Shown with `highlightRole="supporter"` for role-specific items.

---

## 19. Merchant Code Pills

### Component: `MerchantCodePills`
**File:** `src/components/supporter/MerchantCodePills.tsx`

Horizontal pill-shaped buttons showing deposit merchant codes:
```
[ MTN: 090777 ] [ Airtel: 4380664 ]
```

Tapping copies the code to clipboard with toast confirmation.

---

## 20. Angel Pool Investment

### Route: `/angel-pool`
**Component:** `AngelPool.tsx`

### Agreement Route: `/angel-pool-agreement`

### Investment Model

```
Total Pool:     UGX 500,000,000
Total Shares:   25,000
Price/Share:    UGX 20,000
Pool Equity:    8% of Welile
```

### Valuation Scenarios

| Valuation | Share Value (8% / 25,000 shares) |
|---|---|
| $1 Billion | $3,200 per share |
| $3 Billion | $9,600 per share |
| $5 Billion | $16,000 per share |

### Investment via FunderCapitalOpportunities

The Angel Pool tab within `FunderCapitalOpportunities` uses `InvestmentSelectionSheet` for pool type selection and direct investment from wallet balance.

---

## 21. Financial Statement

### Route: `/financial-statement`
**Component:** `FinancialStatement.tsx`

Generates a downloadable financial statement from `general_ledger` entries for the authenticated user, including:
- All deposits, withdrawals, investments
- ROI payments received
- Wallet credits/debits
- Filterable by date range

---

## 22. Funder Portfolio Card (Agent View)

### Component: `FunderPortfolioCard`
**File:** `src/components/agent/FunderPortfolioCard.tsx`

Used by agents to display a funder's portfolio summary:

```typescript
interface FunderPortfolioCardProps {
  funder: { full_name: string; phone: string; };
  stats: {
    totalInvested: number;
    totalROI: number;
    activeCount: number;
    walletBalance: number;
  };
}
```

### Display

```
┌──────────────────────────────────┐
│ John Doe              💼 Funder  │
│ 📞 0771234567                    │
├──────────────────────────────────┤
│  🏦 Invested    📈 Returns      │
│  UGX 2.5M       UGX 375K       │
│  💰 Wallet      Active Accounts │
│  UGX 150K       3              │
├──────────────────────────────────┤
│ Your money is safe & working.    │
└──────────────────────────────────┘
```

Uses `useCurrency()` for responsive formatting (`formatAmountCompact` on mobile, `formatAmount` on desktop).

---

## 23. Backend Architecture

### Data Flow

```
Deposit → Wallet → Investment → Rent Request Funded → ROI Generated → Wallet Credit
```

### Key Financial Flows

#### Deposit → Wallet

```
deposit_requests (submitted)
  → Manager/Auto verification
  → general_ledger: category='deposit', direction='cash_in'
  → wallets: balance += amount
  → sync_wallet_from_ledger (single-writer RPC)
```

#### Wallet → Investment

```
PaymentPartnersDialog → FunderCapitalOpportunities
  → general_ledger: category='supporter_rent_fund', direction='cash_out'
  → investor_portfolios: new record created
  → wallets: balance -= amount
```

#### ROI Payment

```
Monthly ROI cycle:
  → general_ledger: category='supporter_roi_payment', direction='cash_in'
  → wallets: balance += roi_amount
  → notifications: type='reward'
```

#### Investment Withdrawal

```
InvestmentWithdrawButton → investment_withdrawal_requests
  → Partner Ops approval
  → COO approval
  → CFO processing
  → general_ledger: category='capital_withdrawal', direction='cash_out'
  → wallets or external payout
```

---

## 24. Database Tables Reference

### Core Tables

| Table | Purpose | Key Columns |
|---|---|---|
| `profiles` | User profile data | `id`, `full_name`, `phone`, `avatar_url`, `verified` |
| `wallets` | Wallet balances | `user_id`, `balance` |
| `general_ledger` | All financial transactions | `user_id`, `amount`, `direction`, `category`, `transaction_date` |
| `deposit_requests` | Deposit submissions | `user_id`, `amount`, `transaction_id`, `status`, `provider` |
| `pre_registered_tids` | Pre-verified transaction IDs | `transaction_id`, `amount`, `status` |
| `investor_portfolios` | Investment accounts | `investor_id`, `investment_amount`, `roi_percentage`, `status`, `portfolio_code` |
| `rent_requests` | Rent financing requests | `tenant_id`, `supporter_id`, `rent_amount`, `status` |
| `angel_pool_investments` | Angel pool entries | `investor_id`, `amount`, `shares`, `pool_ownership_percent` |
| `angel_pool_config` | Pool configuration | `total_pool_ugx`, `total_shares`, `price_per_share` |
| `investment_withdrawal_requests` | Capital withdrawal requests | `user_id`, `amount`, `status`, `earliest_process_date` |
| `notifications` | User notifications | `user_id`, `title`, `message`, `type`, `is_read` |
| `supporter_agreements` | Agreement acceptance records | `user_id`, `accepted_at`, `version` |

### Ledger Categories for Supporters

| Category | Direction | Meaning |
|---|---|---|
| `deposit` | `cash_in` | Money deposited to wallet |
| `supporter_rent_fund` | `cash_out` | Capital deployed to rent request |
| `supporter_facilitation_capital` | `cash_out` | Facilitation capital deployment |
| `coo_proxy_investment` | `cash_out` | COO-managed investment |
| `supporter_roi_payment` | `cash_in` | ROI payment received |
| `capital_withdrawal` | `cash_out` | Capital withdrawn |
| `withdrawal` | `cash_out` | Wallet withdrawal |

---

## 25. Edge Functions Reference

| Function | Purpose |
|---|---|
| `send-supporter-agreement-email` | Sends agreement terms to supporter's email after acceptance |
| `process-deposit` | Handles deposit verification and wallet crediting |
| `sync-wallet-balance` | Recalculates wallet balance from ledger (single-writer) |
| `send-notification` | Creates notification records |
| `process-withdrawal` | Handles withdrawal request processing |

---

## 26. Security & RLS

### Row-Level Security Policies

| Table | Policy | Rule |
|---|---|---|
| `wallets` | Users see own wallet | `user_id = auth.uid()` |
| `general_ledger` | Users see own entries | `user_id = auth.uid()` |
| `deposit_requests` | Users see own deposits | `user_id = auth.uid()` |
| `investor_portfolios` | Users see own portfolios | `investor_id = auth.uid() OR agent_id = auth.uid()` |
| `notifications` | Users see own notifications | `user_id = auth.uid()` |
| `angel_pool_investments` | Users see own investments | `investor_id = auth.uid()` |

### Financial Integrity

- **Single-Writer Principle:** `sync_wallet_from_ledger` RPC ensures wallet balance always matches ledger sum
- **TID Deduplication:** Transaction IDs checked for uniqueness before approval
- **7-Day Window:** Deposits restricted to 7 days from transaction date
- **Amount Tolerance:** Auto-approval allows 1 UGX tolerance on amount matching

---

## Appendix A: Component File Map

```
src/components/supporter/
├── agreement/
│   ├── SupporterAgreementModal.tsx
│   ├── SupporterAgreementBanner.tsx
│   ├── SupporterAgreementCard.tsx
│   ├── LockedOverlay.tsx
│   ├── AgreementAcceptedBadge.tsx
│   └── index.ts
├── AccountDetailsDialog.tsx
├── CalculatorShareCard.tsx
├── CreateAccountDialog.tsx
├── CreditRequestsFeed.tsx
├── FloatingPortfolioButton.tsx
├── FundAccountDialog.tsx
├── FundRentDialog.tsx
├── FundedHistory.tsx
├── FunderCapitalOpportunities.tsx
├── FundingMilestones.tsx
├── FundingPoolCard.tsx
├── HeroBalanceCard.tsx
├── HouseOpportunities.tsx
├── InterestPaymentHistory.tsx
├── InvestmentAccountCard.tsx
├── InvestmentBreakdownSheet.tsx
├── InvestmentCalculator.tsx
├── InvestmentGoals.tsx
├── InvestmentPackageSheet.tsx
├── InvestmentWithdrawButton.tsx
├── MerchantCodePills.tsx
├── ModernInviteCard.tsx
├── ModernOpportunityTabs.tsx
├── ModernQuickActions.tsx
├── ModernQuickLinks.tsx
├── ModernSectionHeader.tsx
├── MyInvestmentRequests.tsx
├── NotificationBell.tsx
├── NotificationsModal.tsx
├── OpportunityHeroButton.tsx
├── OpportunitySummaryCard.tsx
├── PayLandlordDialog.tsx
├── PayoutMethodDialog.tsx
├── PortfolioSummaryCards.tsx
├── QuickStatsRow.tsx
├── ROIEarningsCard.tsx
├── RentCategoryFeed.tsx
├── RentOpportunities.tsx
├── RequestManagerInvestDialog.tsx
├── SetGoalDialog.tsx
├── ShareCalculatorLink.tsx
├── ShareSupporterLink.tsx
├── SimpleAccountsList.tsx
├── SimpleInvestmentCard.tsx
├── SimpleTenantsList.tsx
├── SupporterLeaderboard.tsx
├── SupporterMenuDrawer.tsx
├── SupporterNotificationsFeed.tsx
├── SupporterROILeaderboard.tsx
├── SupporterReferralStats.tsx
├── TenantRequestDetailsDialog.tsx
├── TenantsNeedingRent.tsx
├── UserProfileDialog.tsx
├── VirtualHouseCard.tsx
├── VirtualHouseDetailsSheet.tsx
├── VirtualHousesFeed.tsx
├── WalletDetailsSheet.tsx
└── WithdrawAccountDialog.tsx
```

### Pages

```
src/pages/
├── BecomeSupporter.tsx      — Onboarding (sign up / sign in)
├── SupporterEarnings.tsx    — ROI analytics & history
├── InvestmentPortfolio.tsx  — Portfolio management
├── DepositHistory.tsx       — Deposit tracking
├── Referrals.tsx            — Referral management
├── FinancialStatement.tsx   — Statement generation
├── TransactionHistory.tsx   — Transaction ledger
├── AngelPool.tsx            — Angel pool page
├── AngelPoolAgreement.tsx   — Angel pool terms
└── Settings.tsx             — Account settings
```

---

## Appendix B: Use Case Scenarios

### Scenario 1: New Supporter Onboarding

1. User clicks referral link → `/become-supporter?ref=abc123`
2. Signs up with phone + password
3. Redirected to dashboard
4. Agreement modal appears → accepts terms
5. Email sent with agreement copy
6. Dashboard unlocked → sees merchant codes

### Scenario 2: First Investment

1. Supporter taps "Add Funds"
2. Opens payment partners dialog → sees MTN code 090777
3. Sends UGX 500,000 via MoMo
4. Returns to app → submits deposit request with TID
5. TID matches pre-registered → auto-approved
6. Wallet balance: UGX 500,000
7. Scrolls to Capital Opportunities → Tenant Rent tab
8. Enters UGX 300,000 → confirms
9. Portfolio created → wallet balance: UGX 200,000
10. Virtual house appears in "My Houses"

### Scenario 3: Monthly ROI Receipt

1. System processes monthly ROI (15%)
2. UGX 45,000 credited to wallet (15% of 300,000)
3. Notification: "🎁 ROI payment of UGX 45,000 credited"
4. Portfolio Summary Card updates monthly return display

### Scenario 4: Capital Withdrawal

1. Supporter taps withdrawal button
2. Selects 50% of deployed capital
3. Chooses MTN MoMo payout
4. Submits with reason
5. 90-day notice period begins
6. Partner Ops reviews → approves
7. COO reviews → approves
8. CFO processes payout → MoMo transfer
9. Notification: "✅ Withdrawal processed"

---

*End of Funder Dashboard Documentation v3.0*
