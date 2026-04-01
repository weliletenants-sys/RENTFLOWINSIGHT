# Tenant Dashboard UI — Complete Feature Reference

> **Last updated:** 2026-03-31
> **Entry point:** `src/components/dashboards/TenantDashboard.tsx`
> **Route:** `/dashboard` (when `role === 'tenant'`)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Dashboard Header](#2-dashboard-header)
3. [Offline Notice](#3-offline-notice)
4. [Tenant Agreement Notice](#4-tenant-agreement-notice)
5. [Profile + Wallet Hero Card](#5-profile--wallet-hero-card)
6. [Verification Checklist](#6-verification-checklist)
7. [Subscription Status Card](#7-subscription-status-card)
8. [Credit Access Limit Card](#8-credit-access-limit-card)
9. [Action Buttons Section](#9-action-buttons-section)
10. [Suggested Houses Card](#10-suggested-houses-card)
11. [Nearby Houses Preview](#11-nearby-houses-preview)
12. [Rent Process Tracker](#12-rent-process-tracker)
13. [Repayment Section](#13-repayment-section)
14. [Rent Calculator](#14-rent-calculator)
15. [Rent Request Form](#15-rent-request-form)
16. [Invite & Earn Card](#16-invite--earn-card)
17. [Wallet Disclaimer](#17-wallet-disclaimer)
18. [Full-Screen Wallet Sheet](#18-full-screen-wallet-sheet)
19. [Tenant Menu Drawer](#19-tenant-menu-drawer)
20. [Pay Landlord Dialog](#20-pay-landlord-dialog)
21. [Payment Partners Dialog](#21-payment-partners-dialog)
22. [Tenant Agreement Modal](#22-tenant-agreement-modal)
23. [Agent Deposit Dialog](#23-agent-deposit-dialog)
24. [Available Houses Sheet](#24-available-houses-sheet)
25. [Mobile Bottom Navigation](#25-mobile-bottom-navigation)
26. [Additional Tenant Components](#26-additional-tenant-components)
27. [Data Flow & Caching](#27-data-flow--caching)
28. [State Management](#28-state-management)

---

## 1. Architecture Overview

| Aspect | Detail |
|---|---|
| **Framework** | React 18, TypeScript, Vite 5 |
| **Styling** | Tailwind CSS v3 + shadcn/ui + Framer Motion animations |
| **State** | Local component state + `useWallet()` hook + `useProfile()` hook |
| **Data** | Supabase queries via `@supabase/supabase-js` |
| **Caching** | Local-first with `localStorage` for instant paint on revisit |
| **Offline** | `useOffline()` context + cached role display when offline |
| **Lazy Loading** | `TenantDashboard` is lazy-loaded from `Dashboard.tsx` via `React.lazy()` |
| **Haptics** | `hapticTap()` / `hapticSuccess()` for mobile tactile feedback |

### Component Tree (simplified)

```
Dashboard.tsx
└── TenantDashboard.tsx
    ├── DashboardHeader
    ├── AnimatePresence (Offline Notice)
    ├── TenantAgreementNotice
    ├── Profile + Wallet Hero Card (motion.div)
    │   ├── UserAvatar
    │   ├── AiIdButton (compact)
    │   ├── Wallet Strip (balance + MoMo indicator)
    │   └── MerchantCodePills
    ├── VerificationChecklist (compact)
    ├── SubscriptionStatusCard
    ├── CreditAccessCard (compact)
    ├── Action Buttons
    │   ├── RentRequestButton (wrapped in LockedActionTooltip)
    │   ├── FindAHouseCTA
    │   └── Menu Button → TenantMenuDrawer
    ├── SuggestedHousesCard
    ├── NearbyHousesPreview
    ├── RentProcessTracker
    ├── RepaymentSection (conditional)
    ├── RentCalculator (conditional, triggered from menu)
    ├── RentRequestForm (conditional, triggered from menu)
    ├── InviteAndEarnCard (variant="tenant")
    ├── WalletDisclaimer
    ├── FullScreenWalletSheet
    ├── TenantMenuDrawer
    ├── PayLandlordDialog
    ├── PaymentPartnersDialog
    ├── TenantAgreementModal
    ├── AgentDepositDialog
    ├── AvailableHousesSheet
    └── MobileBottomNav
```

---

## 2. Dashboard Header

**Component:** `DashboardHeader`
**File:** `src/components/DashboardHeader.tsx`

- Displays the current role label and role-switching UI
- Provides sign-out functionality
- Responsive top bar with branding

---

## 3. Offline Notice

**Rendered inline** in `TenantDashboard.tsx` using `AnimatePresence`

| Feature | Detail |
|---|---|
| **Trigger** | `!isOnline` from `useOffline()` context |
| **Display** | Warning banner: "You're offline — data may be outdated" |
| **Icon** | `WifiOff` (lucide) |
| **Action** | Refresh button (`window.location.reload()`) |
| **Animation** | Framer Motion fade + slide (y: -10) |

---

## 4. Tenant Agreement Notice

**Component:** `TenantAgreementNotice`
**File:** `src/components/tenant/agreement/TenantAgreementNotice.tsx`

- Displays a prominent notice if the tenant has NOT accepted the Welile Tenant Agreement
- Clicking opens `TenantAgreementModal`
- Driven by `useTenantAgreement()` hook → `isAccepted` / `isLoading`

### Related Components

| Component | File | Purpose |
|---|---|---|
| `TenantAgreementModal` | `agreement/TenantAgreementModal.tsx` | Full agreement content + accept button |
| `TenantAgreementContent` | `agreement/TenantAgreementContent.ts` | Static agreement text |
| `TenantAgreementButton` | `agreement/TenantAgreementButton.tsx` | CTA button variant |
| `LockedActionTooltip` | `agreement/LockedActionTooltip.tsx` | Wraps actions that require agreement acceptance |

---

## 5. Profile + Wallet Hero Card

**Rendered inline** as a `motion.div` block

### 5.1 Profile Row
| Feature | Detail |
|---|---|
| **Avatar** | `UserAvatar` component, clickable → navigates to `/settings` |
| **Name** | `profile.full_name` with "Welcome back" subtitle |
| **Verified badge** | `BadgeCheck` icon — filled primary if verified, muted if not |
| **Role label** | "Welile Tenant" |
| **AI ID Button** | `AiIdButton` (compact variant) — digital identity feature |

### 5.2 Wallet Strip
| Feature | Detail |
|---|---|
| **Balance** | Formatted as UGX via `formatUGX()` |
| **Tap action** | Opens `FullScreenWalletSheet` |
| **MoMo indicators** | Auto-detected from phone number regex: MTN (yellow M), Airtel (red A) |
| **Subtitle** | "Tap to open wallet" |

### 5.3 Merchant Code Pills
**Component:** `MerchantCodePills`
**File:** `src/components/supporter/MerchantCodePills.tsx`
- Quick-access merchant/deposit codes
- "Deposit" action button → opens `AgentDepositDialog`

---

## 6. Verification Checklist

**Component:** `VerificationChecklist` (compact mode)
**File:** `src/components/shared/VerificationChecklist.tsx`

| Feature | Detail |
|---|---|
| **Data source** | `useVerificationStatus(userId)` hook |
| **Tiers** | Ordinary User → Rising Star → Trusted Member → Power User → Welile Champion |
| **Progress** | Visual progress bar of verified roles out of total |
| **Expandable** | Tap to expand/collapse in compact mode |
| **Role icons** | 🏠 tenant, 🏃 agent, 🏢 landlord, 💰 supporter |

---

## 7. Subscription Status Card

**Component:** `SubscriptionStatusCard`
**File:** `src/components/tenant/SubscriptionStatusCard.tsx`

| Feature | Detail |
|---|---|
| **Data source** | `subscription_charges` table — filters by `tenant_id` + `status = 'active'` |
| **Fields displayed** | Charges completed, charges remaining, next charge date, accumulated debt, charge amount |
| **Progress bar** | `charges_completed / total_days` as percentage |
| **Debt warning** | Highlighted if `accumulated_debt > 0` |
| **Paid ahead indicator** | Shows if `daysAhead > 0` and no debt |
| **Failed state** | Shown if `tenant_failed_at` is set |
| **Hidden if** | No active subscription found |

---

## 8. Credit Access Limit Card

**Component:** `CreditAccessCard` (compact mode)
**File:** `src/components/CreditAccessCard.tsx`

| Feature | Detail |
|---|---|
| **Data source** | `useCreditAccessLimit(userId)` hook |
| **Max limit** | UGX 30,000,000 |
| **Min limit** | UGX 30,000 |
| **Progress** | Visual bar: `totalLimit / 30M * 100%` |
| **Currency toggle** | UGX / USD / EUR / GBP |
| **Expandable** | Tap to show breakdown details |
| **Request credit** | Opens `CreditAccessDrawSheet` if limit > 0 |
| **Breakdown factors** | Receipt spending, referrals, loan history, marketplace activity |

---

## 9. Action Buttons Section

Three main actions displayed in the dashboard:

### 9.1 Rent Request Button
**Component:** `RentRequestButton`
**File:** `src/components/tenant/RentRequestButton.tsx` (825 lines)

| Feature | Detail |
|---|---|
| **Gating** | Wrapped in `LockedActionTooltip` — requires tenant agreement acceptance |
| **Function** | Multi-step rent request flow |
| **Repayment periods** | 7, 14, 30, 60, 90, 120 days |
| **Platform fee** | UGX 10,000 |
| **Daily access fee rate** | 1.1% |
| **Calculation engine** | `calculateRentRepayment()` from `@/lib/rentCalculations` |
| **Form validation** | `validateFormPayload()` with `RENT_REQUEST_CONTRACT` |
| **Currency support** | Multi-currency via `useCurrency()` hook |
| **Landlord selection** | Fetches registered landlords |
| **Location capture** | GPS coordinates |
| **On success** | Triggers `fetchData()` to refresh dashboard |

### 9.2 Find a House CTA
**Component:** `FindAHouseCTA`
**File:** `src/components/tenant/FindAHouseCTA.tsx`

| Feature | Detail |
|---|---|
| **Data** | Counts from `house_listings` table (available + pending) |
| **New listings** | Shows count of listings created in last 7 days |
| **Realtime** | Subscribes to `postgres_changes` on `house_listings` for INSERT events |
| **Action** | Opens `AvailableHousesSheet` |
| **Icon** | `Search` + `Sparkles` |

### 9.3 Menu Button
| Feature | Detail |
|---|---|
| **Display** | Card-style button with `Menu` icon |
| **Label** | "Menu" / "Payments, tools & more" |
| **Action** | Opens `TenantMenuDrawer` |
| **Haptics** | `hapticTap()` on click |

---

## 10. Suggested Houses Card

**Component:** `SuggestedHousesCard`
**File:** `src/components/tenant/SuggestedHousesCard.tsx`

| Feature | Detail |
|---|---|
| **Algorithm** | Matches houses based on tenant's last rent request amount |
| **Data source** | `house_listings` table cross-referenced with `rent_requests` |
| **Display** | Horizontal scrollable cards with house images |
| **Per card** | Title, address, region, rooms, monthly rent, daily rate, short code |
| **Actions per card** | WhatsApp agent button, share button |
| **View all** | Opens `AvailableHousesSheet` |
| **Icon** | `Sparkles` |

---

## 11. Nearby Houses Preview

**Component:** `NearbyHousesPreview`
**File:** `src/components/tenant/NearbyHousesPreview.tsx` (221 lines)

| Feature | Detail |
|---|---|
| **Data source** | `useNearbyHouses()` hook |
| **Geolocation** | `useGeolocation()` hook for user's lat/lng |
| **Mini map** | Google Maps embed thumbnail per listing |
| **Per listing** | Image gallery (swipeable), map pin, ratings badge, daily rate |
| **Actions** | WhatsApp agent contact, share house, view on map |
| **View all** | Opens `AvailableHousesSheet` |
| **Image lightbox** | `ImageLightbox` component for full-screen image viewing |

---

## 12. Rent Process Tracker

**Component:** `RentProcessTracker`
**File:** `src/components/rent/RentProcessTracker.tsx` (203 lines)

| Feature | Detail |
|---|---|
| **Visibility** | Shown when `rentRequests.length > 0` |
| **Steps tracked** | Agent Verify → Manager Approve → Supporter Fund → Fund Route → Repayment |
| **Status states** | `completed`, `active`, `pending` per step |
| **Status mapping** | pending → approved → funded → disbursed → completed |
| **Fund routing** | Shows `fundRecipientType`, `fundRecipientName`, `fundRoutedAt` |
| **Icons** | Shield, UserCheck, Wallet, Home, CheckCircle2 |
| **Compact mode** | Available via `compact` prop |

---

## 13. Repayment Section

**Component:** `RepaymentSection`
**File:** `src/components/tenant/RepaymentSection.tsx` (661 lines)

| Feature | Detail |
|---|---|
| **Visibility** | Shown when any rent request has status: `disbursed`, `completed`, `funded`, `repaying` |
| **Active request** | Filters for `status === 'disbursed'` or `'repaying'` |
| **Tabs** | Overview / Schedule / History |
| **Progress bar** | Amount paid vs. total repayment |
| **Day-by-day status** | `paid`, `missed`, `upcoming`, `today` |
| **Calendar view** | Visual day grid with color-coded payment status |
| **Streak tracking** | Current streak, longest streak |
| **PDF export** | `downloadRepaymentPdf()` — generates downloadable PDF schedule |
| **WhatsApp share** | `shareRepaymentPdfWhatsApp()` — shares schedule via WhatsApp |
| **Payment methods** | `PaymentPartnersCard` — shows available MoMo payment options |
| **Repayment history** | `RepaymentHistoryDrawer` — full transaction list |

### Sub-components

| Component | File | Purpose |
|---|---|---|
| `RepaymentHistoryDrawer` | `tenant/RepaymentHistoryDrawer.tsx` | Scrollable list of all past repayments |
| `RepaymentScheduleView` | `tenant/RepaymentScheduleView.tsx` | Tabular view with accept/reject schedule actions |
| `PaymentPartnersCard` | `payments/PaymentPartnersCard.tsx` | MoMo payment partner options |

---

## 14. Rent Calculator

**Component:** `RentCalculator`
**File:** `src/components/tenant/RentCalculator.tsx` (135 lines)

| Feature | Detail |
|---|---|
| **Trigger** | Toggled from menu drawer via `showCalculator` state |
| **Income type selector** | `IncomeTypeSelector` — daily vs. weekly/monthly earner |
| **Daily calculator** | Standard rent repayment: amount × duration (30/60/90 days) |
| **Weekly/Monthly** | `WeeklyMonthlyCalculator` component — alternate calculation model |
| **Calculation** | `calculateRentRepayment()` from `@/lib/rentCalculations` |
| **Currency** | Multi-currency via `useCurrency()` + `CurrencySwitcher` |
| **Share** | `RentCalculatorShareButton` — share calculation results |
| **Proceed action** | Closes calculator, opens `RentRequestForm` |

### Sub-components

| Component | File | Purpose |
|---|---|---|
| `IncomeTypeSelector` | `tenant/IncomeTypeSelector.tsx` | Choose income type before calculation |
| `WeeklyMonthlyCalculator` | `tenant/WeeklyMonthlyCalculator.tsx` | Calculator for non-daily earners |
| `RentCalculatorShareButton` | `tenant/RentCalculatorShareButton.tsx` | Share calculation via native share API |

---

## 15. Rent Request Form

**Component:** `RentRequestForm`
**File:** `src/components/tenant/RentRequestForm.tsx`

| Feature | Detail |
|---|---|
| **Trigger** | Opened after calculator "Proceed" or directly from request flow |
| **Fields** | Rent amount, duration, landlord details, property info |
| **Validation** | Form contracts via `validateFormPayload()` |
| **GPS** | Location capture for property verification |
| **On success** | Closes form, refreshes dashboard data, shows toast |
| **On cancel** | Hides the form |

---

## 16. Invite & Earn Card

**Component:** `InviteAndEarnCard` (variant="tenant")
**File:** `src/components/shared/InviteAndEarnCard.tsx` (198 lines)

| Feature | Detail |
|---|---|
| **Referral link** | Generated from user ID |
| **Copy to clipboard** | Tap to copy referral link with haptic feedback |
| **Stats** | Referral count, total earned (from `referrals` + `agent_earnings` tables) |
| **Share** | Native share API or clipboard fallback |
| **Variant styling** | Tenant-specific colors and messaging |

---

## 17. Wallet Disclaimer

**Component:** `WalletDisclaimer`
**File:** `src/components/wallet/WalletDisclaimer.tsx`

- Legal/informational disclaimer about wallet usage
- Displayed at the bottom of the scrollable content area

---

## 18. Full-Screen Wallet Sheet

**Component:** `FullScreenWalletSheet`
**File:** `src/components/wallet/FullScreenWalletSheet.tsx` (406 lines)

| Feature | Detail |
|---|---|
| **Trigger** | Tap on wallet strip in hero card |
| **Layout** | Full-screen sheet overlay |
| **Balance display** | `AnimatedBalance` — smooth number transitions |
| **Profile** | `UserAvatar` + user name |

### Wallet Actions

| Action | Component | Description |
|---|---|---|
| **Send Money** | `SendMoneyDialog` | Transfer to another user |
| **Deposit** | `DepositDialog` | Add funds via MoMo |
| **Request Money** | `RequestMoneyDialog` | Send payment request to someone |
| **Withdraw** | `WithdrawRequestDialog` | Cash out to MoMo |
| **Bill Payment** | `BillPaymentDialog` | Pay utility bills |
| **Food Market** | `FoodMarketDialog` | Food/grocery purchases |

### Wallet Views

| View | Component | Description |
|---|---|---|
| **Pending Requests** | `PendingRequestsDialog` | Incoming/outgoing pending requests |
| **Transaction Receipt** | `TransactionReceipt` | Individual transaction detail |
| **Deposit Requests** | `UserDepositRequests` | Deposit request history |
| **Withdrawal Requests** | `UserWithdrawalRequests` | Withdrawal request history |
| **Ledger Statement** | `WalletLedgerStatement` | Full financial ledger |
| **Agent Rent Requests** | `AgentRentRequestsWalletSection` | Agent-related requests in wallet |

### Wallet Quick Categories (Icons)

Shopping Cart, Utensils, Fuel, Car, Hotel, Stethoscope, Wrench, Coffee, Scissors, BookOpen, Zap, Droplets

---

## 19. Tenant Menu Drawer

**Component:** `TenantMenuDrawer`
**File:** `src/components/tenant/TenantMenuDrawer.tsx` (321 lines)

| Feature | Detail |
|---|---|
| **Trigger** | Menu button on dashboard |
| **Animation** | Framer Motion slide from right (`x: '100%'` → `x: 0`) |
| **Backdrop** | Semi-transparent black overlay with blur |
| **Layout** | 85% width, max-w-sm, full height, scrollable |

### Menu Sections & Items

#### Find a Home
| Item | Description | Action |
|---|---|---|
| Available Houses — Daily Rent | Browse affordable houses, pay daily | Opens `AvailableHousesSheet` |

#### Payments
| Item | Description | Action |
|---|---|---|
| My Repayment Schedule | Daily plan, progress & share as PDF | Toggles `RepaymentSection` |
| Pay Rent to Landlord | Direct landlord payment | Opens `PayLandlordDialog` |
| Pay Welile | Via Mobile Money | Opens `PaymentPartnersDialog` |

#### Tools
| Item | Description | Action |
|---|---|---|
| Post Shopping Receipt | Earn loan limits & rent discounts | Navigate to `/my-receipts` |
| Rent Calculator | Calculate daily repayment | Opens `RentCalculator` inline |
| My Loans | View & manage loans | Navigate to `/my-loans` |
| Marketplace | Shop & earn loan access | Navigate to `/marketplace` |

#### Growth
| Item | Description | Action |
|---|---|---|
| Welile Homes | Turn rent into future home | Navigate to `/welile-homes` |
| My Referrals | People you invited | Navigate to `/referrals` |
| Share & Earn | Invite friends for rewards | Navigate to `/benefits` |
| Transaction History | All past transactions | Navigate to `/transactions` |
| Financial Statement | Download your statement | Navigate to `/financial-statement` |

#### More
| Item | Description | Action |
|---|---|---|
| Tenant Agreement | Terms & conditions | Navigate to `/tenant-agreement` |
| Share App | Invite friends to Welile | Navigate to `/install` |
| Settings | Account preferences | Navigate to `/settings` |
| Help & Support | Get assistance | Navigate to `/settings` |

### Menu Item Features
- **Badges**: "New", "PDF & WhatsApp", "Earn benefits", "Loans up to 30M"
- **Color coding**: Each item has a unique icon color (text-success, text-primary, text-amber-500, etc.)
- **Entry animations**: Staggered `motion.button` with opacity + slide-right
- **Separators**: Between each section
- **Haptic feedback**: `hapticSuccess()` on item click, `hapticTap()` on close

---

## 20. Pay Landlord Dialog

**Component:** `PayLandlordDialog`
**File:** `src/components/wallet/PayLandlordDialog.tsx` (473 lines)

| Feature | Detail |
|---|---|
| **Gating** | Requires accepted tenant agreement |
| **Landlord list** | Fetches registered landlords with property address, phone, monthly rent |
| **Amount** | Input with rent balance due shown |
| **Animation** | Staggered form field reveal |
| **Discount** | `Percent` icon — applicable rent discounts |

---

## 21. Payment Partners Dialog

**Component:** `PaymentPartnersDialog`
**File:** `src/components/payments/PaymentPartnersDialog.tsx`

| Feature | Detail |
|---|---|
| **Gating** | Requires accepted tenant agreement |
| **Dashboard type** | `"tenant"` variant |
| **Title** | "Pay Rent via Mobile Money" |
| **Content** | Lists available MoMo payment partners |

---

## 22. Tenant Agreement Modal

**Component:** `TenantAgreementModal`
**File:** `src/components/tenant/agreement/TenantAgreementModal.tsx`

| Feature | Detail |
|---|---|
| **Content** | Full terms from `TenantAgreementContent.ts` |
| **Accept action** | Calls `acceptAgreement()` from `useTenantAgreement()` |
| **Loading state** | `isAccepting` spinner during acceptance |
| **Unlocks** | Pay Landlord, Pay Welile, Rent Request actions |

---

## 23. Agent Deposit Dialog

**Component:** `AgentDepositDialog`
**File:** `src/components/agent/AgentDepositDialog.tsx`

| Feature | Detail |
|---|---|
| **Trigger** | "Deposit" button on MerchantCodePills |
| **Purpose** | Deposit funds via agent merchant codes |

---

## 24. Available Houses Sheet

**Component:** `AvailableHousesSheet`
**File:** `src/components/tenant/AvailableHousesSheet.tsx` (328 lines)

| Feature | Detail |
|---|---|
| **Layout** | Full-screen sheet overlay |
| **Data** | `useNearbyHouses()` hook + `useGeolocation()` |
| **Search** | Text search input |
| **Region filter** | 19 regions: Central, Eastern, Northern, Western, Kampala, Wakiso, Mukono, Jinja, Mbale, Mbarara, Gulu, Lira, Fort Portal, Masaka, Entebbe, Nansana, Kira, Bweyogerere |
| **Category filter** | Single Room, Double Room, and more |
| **Per listing** | Image carousel (swipeable L/R), amenity icons (water, power, security, parking, furnished), daily rate, map pin |
| **Amenity icons** | `Droplets` (water), `Zap` (power), `ShieldCheck` (security), `Car` (parking), `Sofa` (furnished) |
| **Actions** | WhatsApp agent, share house |
| **Loading** | Skeleton placeholders |

---

## 25. Mobile Bottom Navigation

**Component:** `MobileBottomNav`
**File:** `src/components/MobileBottomNav.tsx`

- Fixed footer navigation bar
- Role-aware: shows tenant-relevant tabs
- Provides quick access to primary screens

---

## 26. Additional Tenant Components

These components exist in `src/components/tenant/` but are not directly rendered in the main dashboard view. They are accessed via menu navigation or sub-flows:

| Component | File | Lines | Purpose |
|---|---|---|---|
| `AchievementBadges` | `AchievementBadges.tsx` | 311 | Gamification — unlockable badges (First Payment, Streak, etc.) with shareable cards |
| `ShareableAchievementCard` | `ShareableAchievementCard.tsx` | — | Generates shareable image of achievement |
| `PaymentStreakCalendar` | `PaymentStreakCalendar.tsx` | 252 | Monthly calendar view color-coded by payment status |
| `LoanProgressWidget` | `LoanProgressWidget.tsx` | 214 | Active loans: amount, interest, paid, due date, progress bar |
| `RentDiscountWidget` | `RentDiscountWidget.tsx` | 228 | Receipt-based rent discount tracker (monthly receipts → discount %) |
| `RentDiscountToggle` | `RentDiscountToggle.tsx` | — | Toggle rent discount application |
| `RentAccessLimitCard` | `RentAccessLimitCard.tsx` | — | Shows rent access limit details |
| `WelileHomesButton` | `WelileHomesButton.tsx` | 521 | "Turn rent into home" — 5-year savings projection, contribution tracking, confetti on milestones |
| `QuickContributeDialog` | `QuickContributeDialog.tsx` | — | Quick contribution to Welile Homes savings |
| `MyLandlordsSection` | `MyLandlordsSection.tsx` | — | Shows registered landlords |
| `RegisterLandlordDialog` | `RegisterLandlordDialog.tsx` | 44 | Form to register a new landlord (name, phone, property, GPS) |
| `WhatsAppAgentButton` | `WhatsAppAgentButton.tsx` | — | Opens WhatsApp chat with assigned agent |
| `ShareHouseButton` | `ShareHouseButton.tsx` | — | Native share API for house listings |
| `InviteFriendsCard` | `InviteFriendsCard.tsx` | — | Referral invitation card |

---

## 27. Data Flow & Caching

### Initial Load Strategy (Local-First)

```
1. Read localStorage(`tenant_dashboard_${userId}`) synchronously
2. If cache exists → render immediately with cached data (no loading spinner)
3. Background fetch from Supabase (non-blocking)
4. On fetch success → update state + update localStorage cache
5. On fetch failure → keep cached data displayed
```

### Data Sources

| Data | Table | Query |
|---|---|---|
| Rent Requests | `rent_requests` | `.eq('tenant_id', user.id).order('created_at', { ascending: false })` |
| Wallet | `useWallet()` hook | Internal wallet table |
| Profile | `useProfile()` hook | `profiles` table |
| Agreement | `useTenantAgreement()` hook | Agreement acceptance records |
| Subscription | `subscription_charges` | `.eq('tenant_id', userId).eq('status', 'active')` |
| Credit Limit | `useCreditAccessLimit()` | Composite calculation from multiple sources |
| Houses | `house_listings` | Via `useNearbyHouses()` + geolocation |
| Referrals | `referrals` + `agent_earnings` | By `referrer_id` / `agent_id` |

### Refresh Mechanism

```typescript
const handleRefresh = async () => {
  await Promise.all([fetchData(), refreshWallet()]);
};
```

---

## 28. State Management

### Dialog/Sheet States (all `useState<boolean>`)

| State | Controls | Default |
|---|---|---|
| `showWallet` | `FullScreenWalletSheet` | `false` |
| `showPayLandlord` | `PayLandlordDialog` | `false` |
| `showPaymentPartners` | `PaymentPartnersDialog` | `false` |
| `showAgreementModal` | `TenantAgreementModal` | `false` |
| `showRepaymentSchedule` | `RepaymentSection` (toggled) | `false` |
| `showCalculator` | `RentCalculator` (inline) | `false` |
| `showRequestForm` | `RentRequestForm` (inline) | `false` |
| `menuOpen` | `TenantMenuDrawer` | `false` |
| `depositOpen` | `AgentDepositDialog` | `false` |
| `housesOpen` | `AvailableHousesSheet` | `false` |
| `isAcceptingAgreement` | Loading state for agreement acceptance | `false` |

### Data States

| State | Type | Source |
|---|---|---|
| `rentRequests` | `RentRequest[]` | localStorage cache + Supabase |
| `repayments` | `Repayment[]` | localStorage cache + Supabase |
| `loading` | `boolean` | `true` unless cache exists |

### Hooks Used

| Hook | Purpose |
|---|---|
| `useAuth()` | User session |
| `useProfile()` | User profile data |
| `useWallet()` | Wallet balance + transactions |
| `useOffline()` | Online/offline detection |
| `useTenantAgreement()` | Agreement acceptance status |
| `useToast()` | Toast notifications |
| `useNavigate()` | React Router navigation |

---

## Appendix: File Index

| File | Lines | Category |
|---|---|---|
| `src/components/dashboards/TenantDashboard.tsx` | 439 | Main dashboard |
| `src/components/tenant/TenantMenuDrawer.tsx` | 321 | Menu drawer |
| `src/components/tenant/RentRequestButton.tsx` | 825 | Rent request flow |
| `src/components/tenant/RepaymentSection.tsx` | 661 | Repayment tracking |
| `src/components/tenant/WelileHomesButton.tsx` | 521 | Home savings |
| `src/components/wallet/PayLandlordDialog.tsx` | 473 | Pay landlord |
| `src/components/wallet/FullScreenWalletSheet.tsx` | 406 | Wallet UI |
| `src/components/tenant/AvailableHousesSheet.tsx` | 328 | House listings |
| `src/components/CreditAccessCard.tsx` | 329 | Credit access |
| `src/components/tenant/AchievementBadges.tsx` | 311 | Gamification |
| `src/components/tenant/PaymentStreakCalendar.tsx` | 252 | Payment calendar |
| `src/components/tenant/RentDiscountWidget.tsx` | 228 | Rent discounts |
| `src/components/tenant/RepaymentScheduleView.tsx` | 224 | Schedule view |
| `src/components/tenant/NearbyHousesPreview.tsx` | 221 | Nearby houses |
| `src/components/tenant/LoanProgressWidget.tsx` | 214 | Loan progress |
| `src/components/rent/RentProcessTracker.tsx` | 203 | Process tracker |
| `src/components/shared/InviteAndEarnCard.tsx` | 198 | Referrals |
| `src/components/shared/VerificationChecklist.tsx` | 189 | Verification |
| `src/components/tenant/SuggestedHousesCard.tsx` | 135 | AI suggestions |
| `src/components/tenant/RentCalculator.tsx` | 135 | Calculator |
| `src/components/tenant/SubscriptionStatusCard.tsx` | 111 | Subscription |
| `src/components/tenant/FindAHouseCTA.tsx` | 89 | Find house CTA |
| `src/components/tenant/RegisterLandlordDialog.tsx` | 44 | Register landlord |
