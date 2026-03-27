# Tenant Module UI — Exhaustive Documentation

> **Last updated**: 2026-03-27  
> **Project**: Welile Receipts  
> **Role**: `tenant` (one of the standard roles provisioned on signup)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Entry Point — TenantDashboard](#2-entry-point--tenantdashboard)
3. [Dashboard Layout & Sections](#3-dashboard-layout--sections)
4. [Core Components](#4-core-components)
5. [Rent Request Flow](#5-rent-request-flow)
6. [Repayment System](#6-repayment-system)
7. [Wallet Integration](#7-wallet-integration)
8. [House Discovery](#8-house-discovery)
9. [Agreement & Terms System](#9-agreement--terms-system)
10. [Menu Drawer — Full Navigation](#10-menu-drawer--full-navigation)
11. [Gamification & Engagement](#11-gamification--engagement)
12. [Verification & Credit](#12-verification--credit)
13. [Communication & Sharing](#13-communication--sharing)
14. [Payments Module](#14-payments-module)
15. [Welile Homes (Rent-to-Own)](#15-welile-homes-rent-to-own)
16. [Component File Map](#16-component-file-map)
17. [Hooks & State Management](#17-hooks--state-management)
18. [Data Flow & Caching](#18-data-flow--caching)
19. [Dialog/Sheet State Map](#19-dialogsheet-state-map)

---

## 1. Architecture Overview

```
src/components/dashboards/TenantDashboard.tsx   ← Main orchestrator (439 lines)
src/components/tenant/                           ← 30+ tenant-specific components
src/components/tenant/agreement/                 ← Terms acceptance sub-module (5 files)
src/components/payments/TenantPaymentsWidget.tsx ← Payment widget
src/hooks/useTenantAgreement.ts                  ← Agreement state hook
```

**Design pattern**: Mobile-first, card-based layout. `max-w-lg mx-auto` centered container. Framer Motion animations. Local-first caching with `localStorage` for instant paint. Offline-aware with graceful degradation.

**Key principles**:
- All actions gated behind **Terms Acceptance** (via `LockedActionTooltip`)
- Haptic feedback on all interactive elements (`hapticTap`, `hapticSuccess`)
- UGX currency formatting throughout (`formatUGX`)
- Bottom navigation bar (`MobileBottomNav`) fixed at viewport bottom

---

## 2. Entry Point — TenantDashboard

**File**: `src/components/dashboards/TenantDashboard.tsx`  
**Props**:

| Prop | Type | Description |
|------|------|-------------|
| `user` | `User` (Supabase) | Authenticated user object |
| `signOut` | `() => Promise<void>` | Sign-out handler |
| `currentRole` | `AppRole` | Active role (should be `tenant`) |
| `availableRoles` | `AppRole[]` | All roles the user has |
| `onRoleChange` | `(role) => void` | Switch to another role |
| `addRoleComponent` | `ReactNode` | UI for requesting additional roles |

**Internal state** (13 dialog/sheet states):
- `showWallet`, `showPayLandlord`, `showPaymentPartners`, `showAgreementModal`
- `showRepaymentSchedule`, `showCalculator`, `showRequestForm`
- `menuOpen`, `depositOpen`, `housesOpen`
- `isAcceptingAgreement`
- `rentRequests[]`, `repayments[]`, `loading`

---

## 3. Dashboard Layout & Sections

The dashboard renders top-to-bottom in this order:

| # | Section | Component | Visibility |
|---|---------|-----------|------------|
| 1 | Dashboard Header | `DashboardHeader` | Always |
| 2 | Offline Notice | Inline `AnimatePresence` | When offline |
| 3 | Terms Acceptance Notice | `TenantAgreementNotice` | Until terms accepted |
| 4 | Profile + Wallet Hero | Inline Card | Always |
| 5 | Merchant Code Pills | `MerchantCodePills` | Always |
| 6 | Verification Checklist | `VerificationChecklist` | Always (compact) |
| 7 | Subscription Status | `SubscriptionStatusCard` | Always |
| 8 | Credit Access Limit | `CreditAccessCard` | Always (compact) |
| 9 | Actions Section | Label + children | Always |
| 9a | → Request Rent | `RentRequestButton` | Always (locked if no terms) |
| 9b | → Find a House | `FindAHouseCTA` | Always |
| 9c | → Menu | Inline button | Always |
| 10 | Suggested Houses | `SuggestedHousesCard` | Always |
| 11 | Nearby Houses | `NearbyHousesPreview` | Always |
| 12 | Rent Process Tracker | `RentProcessTracker` | If rent requests exist |
| 13 | Repayment Section | `RepaymentSection` | If active/completed requests |
| 14 | Rent Calculator | `RentCalculator` | On toggle from menu |
| 15 | Request Form | `RentRequestForm` | On toggle |
| 16 | Repayment Schedule | `RepaymentSection` (alt) | On toggle from menu |
| 17 | Invite & Earn | `InviteAndEarnCard` | Always |
| 18 | Wallet Disclaimer | `WalletDisclaimer` | Always |
| 19 | Mobile Bottom Nav | `MobileBottomNav` | Always (fixed) |

**Overlays/Sheets** (rendered at bottom of JSX):
- `FullScreenWalletSheet` — full wallet management
- `TenantMenuDrawer` — slide-up menu
- `PayLandlordDialog` — direct landlord payment
- `PaymentPartnersDialog` — Mobile Money payment
- `TenantAgreementModal` — terms acceptance
- `AgentDepositDialog` — deposit via agent
- `AvailableHousesSheet` — house marketplace

---

## 4. Core Components

### 4.1 Profile + Wallet Hero Card
Inline component showing:
- **User avatar** (clickable → `/settings`)
- **Welcome message** with full name
- **Verification badge** (filled if verified, greyed if not)
- **AI ID Button** (compact)
- **Wallet strip** — shows balance in UGX, tap to open full wallet sheet
  - Mobile Money provider badges (MTN yellow "M", Airtel red "A") auto-detected from phone number

### 4.2 RentRequestButton
**File**: `src/components/tenant/RentRequestButton.tsx` (825 lines)
- Complex multi-step rent request widget
- Gated behind `LockedActionTooltip` (requires terms acceptance)
- Props: `userId`, `onSuccess`

### 4.3 FindAHouseCTA
**File**: `src/components/tenant/FindAHouseCTA.tsx` (89 lines)
- Animated CTA card for house discovery
- Shows live count of available houses from database
- Sparkles icon + animated text variants
- Triggers `AvailableHousesSheet` on click

### 4.4 RentCalculator
**File**: `src/components/tenant/RentCalculator.tsx` (135 lines)
- Input monthly rent → calculate daily repayment
- Shows access fee (33%), platform fee, total, and daily amount
- "Proceed to Request" button → opens `RentRequestForm`

### 4.5 WeeklyMonthlyCalculator
**File**: `src/components/tenant/WeeklyMonthlyCalculator.tsx` (262 lines)
- Alternative calculator for weekly/monthly income earners
- Different repayment schedule computation

### 4.6 IncomeTypeSelector
**File**: `src/components/tenant/IncomeTypeSelector.tsx` (61 lines)
- Selector UI: Daily | Weekly-Monthly income type
- Determines which calculator variant to show

---

## 5. Rent Request Flow

### Flow sequence:
```
RentRequestButton (825 lines)
    ↓ User enters rent amount, landlord details, duration
RentRequestForm (635 lines)
    ↓ Submits to `rent_requests` table
    ↓ Status: 'pending'
RentProcessTracker
    ↓ Visual pipeline: Submitted → Agent Verified → Manager Approved → Funded → Disbursed
RepaymentSection (660 lines)
    ↓ Active once status = 'disbursed' or 'repaying'
RepaymentHistoryDrawer (914 lines)
    ↓ Full history of daily deductions/payments
RepaymentScheduleView (224 lines)
    ↓ Calendar view of scheduled payments
```

### RentRequestForm
**File**: `src/components/tenant/RentRequestForm.tsx` (635 lines)
- Multi-field form: rent amount, landlord info, property details, duration
- Validation and submission to database
- Props: `userId`, `onSuccess`, `onCancel`

### RentProcessTracker
**File**: `src/components/rent/RentProcessTracker.tsx`
- Visual progress pipeline showing request status
- Statuses: `submitted → agent_verified → manager_approved → funded → disbursed → completed`
- Shows fund recipient type and routing info

---

## 6. Repayment System

### 6.1 RepaymentSection
**File**: `src/components/tenant/RepaymentSection.tsx` (660 lines)
- Summary card showing:
  - Total rent owed
  - Amount repaid (with progress bar)
  - Outstanding balance
  - Daily deduction amount
- Real-time data from database

### 6.2 RepaymentHistoryDrawer
**File**: `src/components/tenant/RepaymentHistoryDrawer.tsx` (914 lines — largest component)
- Full scrollable history of all repayments
- Each entry: date, amount, method, status
- Filterable and searchable

### 6.3 RepaymentScheduleView
**File**: `src/components/tenant/RepaymentScheduleView.tsx` (224 lines)
- Calendar/list view of upcoming scheduled payments
- Shareable as PDF & WhatsApp

### 6.4 PaymentStreakCalendar
**File**: `src/components/tenant/PaymentStreakCalendar.tsx` (252 lines)
- Visual calendar showing payment streaks
- Flame icon for active streaks
- Monthly navigation

---

## 7. Wallet Integration

### FullScreenWalletSheet
- Full wallet management sheet
- Shows balance, transaction history
- Deposit and withdrawal options

### PayLandlordDialog
- Direct payment to landlord from wallet
- Requires terms acceptance

### PaymentPartnersDialog
- Mobile Money payment flow
- Multiple provider support (MTN, Airtel)

### MerchantCodePills
- Quick-access merchant codes for deposits
- Inline on wallet hero card

### AgentDepositDialog
- Deposit cash via an agent
- Agent-mediated flow

### TenantPaymentsWidget
**File**: `src/components/payments/TenantPaymentsWidget.tsx` (65 lines)
- Compact payments card showing:
  - Wallet balance ("Rent Money")
  - Rent due amount (orange text)
  - Due date
- Two action buttons: "Pay Rent" → `PayRentFlow`, "Deposit" → `DepositFlow`

---

## 8. House Discovery

### 8.1 FindAHouseCTA
- Hero CTA on dashboard
- Shows live house count
- Animated with framer-motion

### 8.2 AvailableHousesSheet
**File**: `src/components/tenant/AvailableHousesSheet.tsx` (328 lines)
- Full-screen sheet with search, filters (area, price range, bedrooms)
- Card-based house listings with images
- Verification badges ("Pending Verification" / "Verified")
- Daily rate display

### 8.3 NearbyHousesPreview
**File**: `src/components/tenant/NearbyHousesPreview.tsx` (221 lines)
- Auto-detects user location
- Shows nearby houses as horizontal scroll cards
- Image lightbox integration
- MapPin, DoorOpen, Home icons
- "View All" → opens AvailableHousesSheet

### 8.4 SuggestedHousesCard
**File**: `src/components/tenant/SuggestedHousesCard.tsx` (130 lines)
- AI-matched house suggestions based on user profile
- Uses `react-query` for data fetching
- Sparkles icon for AI branding
- Shows daily rate, location, bedrooms

### 8.5 ShareHouseButton
**File**: `src/components/tenant/ShareHouseButton.tsx` (60 lines)
- Share a house listing via Web Share API / clipboard
- Generates shareable URL with house ID

---

## 9. Agreement & Terms System

### Architecture
```
src/components/tenant/agreement/
├── index.ts                     ← Re-exports
├── TenantAgreementButton.tsx    ← Compact button (accepted/pending states)
├── TenantAgreementContent.ts    ← Terms text content
├── TenantAgreementModal.tsx     ← Full modal with scrollable terms
├── TenantAgreementNotice.tsx    ← Banner notice on dashboard
└── LockedActionTooltip.tsx      ← Wrapper that blocks actions until terms accepted
```

### Flow:
1. **TenantAgreementNotice** — yellow banner on dashboard if terms not accepted
2. User clicks → **TenantAgreementModal** opens
3. User reads & accepts → `useTenantAgreement` hook saves to database
4. **LockedActionTooltip** unlocks all gated actions (rent requests, payments)
5. **TenantAgreementButton** shows green "Terms Accepted ✅" badge

### useTenantAgreement Hook
**File**: `src/hooks/useTenantAgreement.ts` (108 lines)
- States: `isAccepted`, `isLoading`
- Method: `acceptAgreement()` → persists to database
- Checks on mount for existing acceptance

### LockedActionTooltip
**File**: `src/components/tenant/agreement/LockedActionTooltip.tsx` (39 lines)
- Wraps child component
- When `isLocked=true`: shows tooltip/overlay explaining terms must be accepted
- When `isLocked=false`: renders children normally

---

## 10. Menu Drawer — Full Navigation

**File**: `src/components/tenant/TenantMenuDrawer.tsx` (321 lines)

Slide-up drawer with categorized menu items:

### Find a Home
| Item | Icon | Action | Badge |
|------|------|--------|-------|
| Available Houses — Daily Rent | Search | Opens AvailableHousesSheet | "New" |

### Payments
| Item | Icon | Action | Badge |
|------|------|--------|-------|
| My Repayment Schedule | Calendar | Toggle repayment view | "PDF & WhatsApp" |
| Pay Rent to Landlord | Home | Opens PayLandlordDialog | — |
| Pay Welile | CreditCard | Opens PaymentPartnersDialog | — |

### Tools
| Item | Icon | Action | Badge |
|------|------|--------|-------|
| Post Shopping Receipt | Receipt | Navigate → `/my-receipts` | "Earn benefits" |
| Rent Calculator | Calculator | Toggle calculator | — |
| My Loans | Banknote | Navigate → `/my-loans` | — |
| Marketplace | ShoppingBag | Navigate → `/marketplace` | "Loans up to 30M" |

### Growth
| Item | Icon | Action | Badge |
|------|------|--------|-------|
| Welile Homes | PiggyBank | Navigate → `/welile-homes` | — |
| My Referrals | Users | Navigate → `/referrals` | — |
| Share & Earn | Share2 | Navigate → `/benefits` | — |
| Transaction History | History | Navigate → `/transactions` | — |
| Financial Statement | FileText | Navigate → `/financial-statement` | — |

### More
| Item | Icon | Action |
|------|------|--------|
| Tenant Agreement | ScrollText | Navigate → `/terms` |
| Settings | Settings | Navigate → `/settings` |
| Help & Support | HelpCircle | Navigate → `/support` |

---

## 11. Gamification & Engagement

### 11.1 AchievementBadges
**File**: `src/components/tenant/AchievementBadges.tsx` (311 lines)
- Achievement system with unlockable badges
- Tracks milestones (payment streaks, referrals, etc.)
- Fetches from database

### 11.2 ShareableAchievementCard
**File**: `src/components/tenant/ShareableAchievementCard.tsx` (286 lines)
- Generates shareable image of achievements using `html-to-image`
- Share via Web Share API
- Visual card with badge display

### 11.3 PaymentStreakCalendar
- (See section 6.4)

### 11.4 InviteFriendsCard
**File**: `src/components/tenant/InviteFriendsCard.tsx` (147 lines)
- Referral sharing card
- Copy link, share via WhatsApp
- Shows referral count and rewards

### 11.5 InviteAndEarnCard
- Shared component with `variant="tenant"` styling
- Referral incentive card

---

## 12. Verification & Credit

### 12.1 VerificationChecklist
- Compact checklist showing verification steps completed
- Highlights `tenant` role requirements
- Props: `userId`, `highlightRole="tenant"`, `compact`

### 12.2 SubscriptionStatusCard
**File**: `src/components/tenant/SubscriptionStatusCard.tsx` (111 lines)
- Shows subscription plan status
- Active/expired/trial indicators
- Icons: CalendarCheck, AlertTriangle, Clock, ShieldCheck

### 12.3 CreditAccessCard
- Shows available credit/rent access limit
- Compact variant on dashboard
- Props: `userId`, `compact`

### 12.4 RentAccessLimitCard
**File**: `src/components/tenant/RentAccessLimitCard.tsx` (34 lines)
- Minimal card showing current rent access limit
- Wallet icon + chevron for navigation

### 12.5 RentDiscountToggle
**File**: `src/components/tenant/RentDiscountToggle.tsx` (101 lines)
- Toggle to opt-in/out of rent discount program
- Persists preference to database

### 12.6 RentDiscountWidget
**File**: `src/components/tenant/RentDiscountWidget.tsx` (227 lines)
- Shows current discount tier and progress to next tier
- Progress bar visualization
- Navigate to discount details

---

## 13. Communication & Sharing

### 13.1 WhatsAppAgentButton
**File**: `src/components/tenant/WhatsAppAgentButton.tsx` (41 lines)
- One-tap WhatsApp message to assigned agent
- Props: `phone`, `agentName`
- Opens `wa.me` link with pre-filled message

### 13.2 RentCalculatorShareButton
**File**: `src/components/tenant/RentCalculatorShareButton.tsx` (100 lines)
- Share rent calculation results
- Generates referral-linked URL
- Copy to clipboard with toast feedback

### 13.3 ShareHouseButton
- (See section 8.5)

### 13.4 QuickContributeDialog
**File**: `src/components/tenant/QuickContributeDialog.tsx` (177 lines)
- Quick dialog for making a contribution/payment
- Input amount, select method
- Confirmation step

---

## 14. Payments Module

### Tenant-facing payment components:
| Component | File | Purpose |
|-----------|------|---------|
| `TenantPaymentsWidget` | `payments/TenantPaymentsWidget.tsx` | Dashboard widget with balance + rent due |
| `PayRentFlow` | `payments/PayRentFlow.tsx` | Multi-step rent payment flow |
| `DepositFlow` | `payments/DepositFlow.tsx` | Deposit money into wallet |
| `PayLandlordDialog` | `wallet/PayLandlordDialog.tsx` | Direct landlord payment |
| `FullScreenWalletSheet` | `wallet/FullScreenWalletSheet.tsx` | Complete wallet management |
| `PaymentPartnersDialog` | `payments/PaymentPartnersDialog.tsx` | Mobile Money payment |
| `AgentDepositDialog` | `agent/AgentDepositDialog.tsx` | Cash deposit via agent |

---

## 15. Welile Homes (Rent-to-Own)

### 15.1 WelileHomesButton
**File**: `src/components/tenant/WelileHomesButton.tsx` (521 lines)
- Complex CTA card for the rent-to-own program
- Shows savings growth metrics, streaks, trophies
- Multiple icon animations
- Navigates to `/welile-homes`

### 15.2 TenantSavingsGrowthChart
**File**: `src/components/welile-homes/TenantSavingsGrowthChart.tsx`
- Recharts-based savings growth visualization
- Historical and projected savings data

### 15.3 RegisterLandlordDialog
**File**: `src/components/tenant/RegisterLandlordDialog.tsx` (44 lines)
- Register a new landlord from tenant side
- Geolocation integration (`useGeoLocation`)

### 15.4 MyLandlordsSection
**File**: `src/components/tenant/MyLandlordsSection.tsx` (435 lines)
- List of tenant's landlords
- Animated with framer-motion
- CRUD operations on landlord relationships

---

## 16. Component File Map

```
src/components/tenant/
├── AchievementBadges.tsx            311 lines  — Badge/milestone system
├── AvailableHousesSheet.tsx         328 lines  — House marketplace sheet
├── FindAHouseCTA.tsx                 89 lines  — Dashboard CTA for houses
├── IncomeTypeSelector.tsx            61 lines  — Daily/weekly income picker
├── InviteFriendsCard.tsx            147 lines  — Referral sharing
├── LoanProgressWidget.tsx           214 lines  — Loan status tracker
├── MyLandlordsSection.tsx           435 lines  — Landlord management
├── NearbyHousesPreview.tsx          221 lines  — Geo-based house preview
├── PaymentStreakCalendar.tsx         252 lines  — Payment streak visual
├── QuickContributeDialog.tsx        177 lines  — Quick payment dialog
├── RegisterLandlordDialog.tsx        44 lines  — Add landlord form
├── RentAccessLimitCard.tsx           34 lines  — Credit limit display
├── RentCalculator.tsx               135 lines  — Rent cost calculator
├── RentCalculatorShareButton.tsx    100 lines  — Share calculator results
├── RentDiscountToggle.tsx           101 lines  — Discount opt-in toggle
├── RentDiscountWidget.tsx           227 lines  — Discount tier progress
├── RentRequestButton.tsx            825 lines  — Main rent request CTA
├── RentRequestForm.tsx              635 lines  — Full rent request form
├── RepaymentHistoryDrawer.tsx       914 lines  — Payment history (largest)
├── RepaymentScheduleView.tsx        224 lines  — Scheduled payments view
├── RepaymentSection.tsx             660 lines  — Repayment summary
├── ShareHouseButton.tsx              60 lines  — Share listing
├── ShareableAchievementCard.tsx     286 lines  — Shareable badge image
├── SubscriptionStatusCard.tsx       111 lines  — Subscription status
├── SuggestedHousesCard.tsx          130 lines  — AI-suggested houses
├── TenantMenuDrawer.tsx             321 lines  — Full navigation drawer
├── WeeklyMonthlyCalculator.tsx      262 lines  — Alt calculator
├── WelileHomesButton.tsx            521 lines  — Rent-to-own CTA
├── WhatsAppAgentButton.tsx           41 lines  — WhatsApp agent link
└── agreement/
    ├── index.ts                       5 lines  — Re-exports
    ├── LockedActionTooltip.tsx        39 lines  — Action gate
    ├── TenantAgreementButton.tsx      80 lines  — Accept/view toggle
    ├── TenantAgreementContent.ts      36 lines  — Terms text
    ├── TenantAgreementModal.tsx      239 lines  — Full terms modal
    └── TenantAgreementNotice.tsx      29 lines  — Dashboard banner

Total: ~6,900+ lines across 35 files
```

---

## 17. Hooks & State Management

| Hook | File | Purpose |
|------|------|---------|
| `useTenantAgreement` | `hooks/useTenantAgreement.ts` | Terms acceptance state + persist |
| `useWallet` | `hooks/useWallet.ts` | Wallet balance, refresh |
| `useProfile` | `hooks/useProfile.ts` | User profile data |
| `useOffline` | `contexts/OfflineContext` | Online/offline status |
| `useAuth` | `hooks/useAuth.ts` | Auth state, role switching |
| `useGeoLocation` | `hooks/useGeoLocation.ts` | GPS coordinates |
| `useHouseListings` | `hooks/useHouseListings.ts` | House marketplace data |
| `useCurrency` | `hooks/useCurrency.ts` | Currency formatting/switching |
| `useVerificationStatus` | `hooks/useVerificationStatus.ts` | KYC verification state |

---

## 18. Data Flow & Caching

### Local-First Strategy
```
1. On mount: Read localStorage cache → render immediately (no loading spinner)
2. Background fetch: Query Supabase → update state + cache
3. On refresh: Pull latest + refresh wallet
4. Offline: Show cached data + offline banner
```

**Cache key**: `tenant_dashboard_{userId}`  
**Cache shape**: `{ rentRequests: [], repayments: [], timestamp: number }`

### Database Tables Used
| Table | Purpose |
|-------|---------|
| `rent_requests` | All rent request records |
| `repayments` | Payment history |
| `wallets` | Balance management |
| `profiles` | User profile + verification |
| `tenant_agreements` | Terms acceptance records |
| `house_listings` | Available properties |
| `referrals` | Referral tracking |
| `subscriptions` | Subscription plans |

---

## 19. Dialog/Sheet State Map

| State Variable | Controls | Trigger |
|----------------|----------|---------|
| `showWallet` | `FullScreenWalletSheet` | Tap wallet strip |
| `showPayLandlord` | `PayLandlordDialog` | Menu → Pay Rent to Landlord |
| `showPaymentPartners` | `PaymentPartnersDialog` | Menu → Pay Welile |
| `showAgreementModal` | `TenantAgreementModal` | Notice banner / locked actions |
| `showRepaymentSchedule` | `RepaymentSection` (toggle) | Menu → My Repayment Schedule |
| `showCalculator` | `RentCalculator` (toggle) | Menu → Rent Calculator |
| `showRequestForm` | `RentRequestForm` (toggle) | Calculator → Proceed |
| `menuOpen` | `TenantMenuDrawer` | Menu button tap |
| `depositOpen` | `AgentDepositDialog` | Merchant code pills |
| `housesOpen` | `AvailableHousesSheet` | FindAHouseCTA / Menu / SuggestedHouses |

---

## Summary

The Tenant Module is a **35-component, 6,900+ line** mobile-first module serving as the primary interface for tenants in the Welile platform. It covers the complete tenant lifecycle:

1. **Onboarding** — Terms acceptance, verification checklist
2. **Rent Access** — Credit limits, rent calculators, request forms
3. **House Discovery** — Nearby houses, AI suggestions, search & filter
4. **Payments** — Wallet, Mobile Money, landlord payments, agent deposits
5. **Repayment** — Progress tracking, history, schedules, PDF sharing
6. **Growth** — Welile Homes (rent-to-own), referrals, achievements
7. **Communication** — WhatsApp agent, share links, invite friends
