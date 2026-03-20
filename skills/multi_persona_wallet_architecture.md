# Multi-Persona Fintech Architecture & Unified Business Logic

This document details the architectural design for transitioning RentFlow Insight to a **multi-persona mode-based platform** driven by a strictly segregated **Wallet Bucket** financial engine, while fully incorporating the established business mechanics for Tenants, Agents, and Supporters.

---

## 1. Database Schema Additions & Unified Wallets

A user represents a single human identity with one unified wallet, categorized internally by strict buckets. They manage their current app context via a requested Persona Mode.

```sql
-- 1. Identity & Context
CREATE TABLE user_personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  persona VARCHAR(50) NOT NULL, -- 'tenant', 'funder', 'agent', 'landlord', 'admin'
  is_default BOOLEAN DEFAULT false,
  UNIQUE(user_id, persona)
);

-- 2. Persona Requisitions (Application for new roles)
CREATE TABLE persona_requisitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  requested_persona VARCHAR(50) NOT NULL,
  justification TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Unified Wallet Engine
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) UNIQUE ON DELETE CASCADE,
  total_balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT positive_balance CHECK (total_balance >= 0)
);

-- 4. The Bucket System (Internal Sandbox)
CREATE TABLE wallet_buckets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  bucket_type VARCHAR(50) NOT NULL, -- 'available', 'invested', 'commission', 'reserved', 'savings'
  balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
  UNIQUE(wallet_id, bucket_type)
);

-- 5. Immutable Double-Entry Ledger
CREATE TABLE general_ledger (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  amount NUMERIC(15, 2) NOT NULL,
  from_bucket VARCHAR(50), 
  to_bucket VARCHAR(50),   
  transaction_type VARCHAR(100) NOT NULL, 
  reference_id UUID, 
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. Requisition-Gated Persona System & UI Flows

Users sign up with one initial persona. **They are NOT granted other personas automatically.** To switch to a different operational mode (e.g. crossing from Funder to Agent), they must formally apply via the Requisitions System.

### A. The Persona Requisition Workflow
1. User navigates to their profile settings and clicks `Apply for New Persona`.
2. They select the persona (e.g. "Agent") and submit a justification or required documentation.
3. System inserts a `persona_requisitions` row with `status = 'pending'`.
4. The Operations Manager reviews the request in the Admin Hub.
5. If approved, the system inserts the string `agent` into the user's `user_personas` array/table.
6. The user is notified and only then granted access to the `/agent` dashboard.

### B. Tenant Mode
**Visible Wallet Metric:** `bucket.available` + `bucket.savings` (Welile Homes)  
**Core Mechanics:**
- **Onboarding:** Multi-step wizard capturing National ID, Selfie, LC1 Letter, and property GPS.
- **Rent Fees:** 
  - Compounding Access Fee: 23% (Low), 28% (Medium), or 33% (High). `Fee = Rent × ((1+Rate)^(Days/30) - 1)`
  - Flat Request Fee: UGX 10k (≤200k rent) or UGX 20k (>200k rent).
- **Repayment Engine (cron at 06:00 UTC):** Deducts daily from `bucket.available`.
- **Welile Homes Savings:** Auto-redirects 10% of repaid principal to `bucket.savings` earning 5% monthly interest.

### C. Agent Mode
**Visible Wallet Metric:** `bucket.commission` (for earnings) + `float_limit` (for operations)   
**Core Mechanics:**
- **Offline-First:** Aggressively caches tenants, stats, and registration forms using `localStorage` and Service Workers.
- **Revenue Streams (Credited directly to `bucket.commission`):**
  - Tenant Lifecycle: UGX 500 (Reg) + UGX 5k (Verify) + UGX 5k (Approval).
  - Proxy Investment: 2% of capital deposited for a partner.
  - Rent Repayment: 5% of collected capital (split 4% to sub-agent, 1% to super agent if hierarchal).
  - Property Mgmt: 2% of rent gathered for offline landlords.

### D. Supporter (Funder) Mode
**Visible Wallet Metric:** `bucket.invested` (Capital deployed) + `bucket.available` (Liquid ROI/deposits)  
**Core Mechanics:**
- **Privacy:** Supporters view "Virtual Houses" with health indicators (Green/Yellow/Red)—never PII details.
- **ROI Engine:** 15% (Standard) or 20% (Premium) compounding or payout configuration.
- **Payment Cycle:** Strict 30-day payout anchors generating entries from `system_revenue` to the Supporter's `bucket.available`.
- **The Liquidity Withdrawal Gate:** 
  - To withdraw capital, the Supporter submits a request. 
  - The request mandates a **90-Day Processing Notice**.
  - Immediate effect: `rewards_paused = true`. The `bucket.invested` stops accruing ROI.

### E. Admin Hub (Back-Office Operations)
**Access Control:** Strictly restricted to users with `admin` persona and specific internal Role Based Access Control (CEO, CFO, COO, CRM).  
**Core Mechanics:**
1. **Persona Requisition Management (CRM/COO):** Dashboards to review pending applications in `persona_requisitions`. Admins verify documents and execute the `Approve` action, securely injecting the new persona into the user's account.
2. **CFO Reconciliation Engine:** A global financial dashboard that forces the mathematical check `Wallet.TotalBalance == SUM(Bucket.Balances)`. Flagged mismatches trigger instant freeze alerts.
3. **Liquidity & Withdrawal Gates (CFO):** Reviewing 90-day capital withdrawal requests from Supporters. Releasing the lock requires explicit authorization, creating a traceable ledger event (`type: manual_withdrawal_approval`).
4. **General Operations (COO/CEO):** High-level aggregate metrics across all active Personas (Tenant payment rates, Agent acquisition costs, Funder ROI liabilities).

---

## 3. Financial Examples & Ledger Workflows

### Flow 1: Supporter Funding Rent Pool
1. Supporter deposits UGX 5M via MoMo.
   - *Ledger:* `from: external`, `to: available`, `type: deposit`
2. Supporter confirms "Fund Rent Pool" for 5M on the 15% Standard plan.
   - *Ledger:* `from: available`, `to: invested`, `type: investment_lock`
3. 30 Days Later (ROI Cron Job):
   - *Ledger:* `from: system_revenue`, `to: available`, `amount: 750,000`, `type: roi_payout`

### Flow 2: The Tenant Hierarchy Default (System Fallback)
1. Tenant rent repayment fails (Insufficient funds in `bucket.available`).
2. The Auto-Charge Engine targets the assigned Agent's `bucket.available`.
3. If Agent's `available` is empty, system tries Agent's `bucket.commission`.
4. If still insufficient, an `OBLIGATION` is added to the Agent's `bucket.reserved` representing rolling debt at 0.96% daily interest.

---

## 4. Edge Cases & Constraints

- **Insufficient Pool Likelihood:** CFO logic checks `PoolBalance > (15% * Total Active Capital)` before underwriting new rent. Deployments are halted if the buffer falls behind.
- **Illegal Bucket Movement:** No user can move funds out of `bucket.invested` directly to `bucket.available`. It requires a 90-day withdrawal request that triggers a manager workflow (`supporter_capital_return`).
- **Mode Hijacking Attempt:** If a user without an approved Agent Mode requisition tries to `POST /api/v1/agent/action`, the unified middleware checks the `user_personas` array and strictly blocks it via HTTP 403 Forbidden.

## 5. CFO Reconciliation Target

The CFO Dashboard enforces strict algebraic equilibrium dynamically:
> `wallets.total_balance` MUST ALWAYS EQUAL `SUM(bucket.available + bucket.invested + bucket.commission + bucket.savings)`. 

If a database misfire or manual DB intervention breaks this equality, the User ID is immediately flagged `FROZEN`, blocking all endpoints for that user until the discrepancy is audited.

## 6. Live Data Migration Strategy (Zero Data Loss)

Because this platform already has **live production data**, we cannot simply drop tables or perform destructive schema resets. All user wallets, balances, and ledger trails must be preserved. 

The transition to the Multi-Persona Bucket Architecture will follow a **3-Phase Forward-Only Migration**:

### Phase 1: Schema Extension & Non-Destructive Adds
1. Create `wallet_buckets`, `user_personas`, and `persona_requisitions` tables.
2. Modify `general_ledger` to add `from_bucket` and `to_bucket` columns.

### Phase 2: Data Backfilling (The "Bucketizer" Script)
1. **Persona Mapping:** For every user, read their current `user_roles` array. Insert corresponding records into `user_personas` (effectively auto-approving their legacy default modes).
2. **Bucket Initialization:**
   - Query ledger to map balances semantics:
   - Investments => `bucket.invested`
   - Agent Float/Earnings => `bucket.commission`
   - The remainder => `bucket.available`
3. **Ledger Patching:** Update existing `general_ledger` rows to backfill the `from_bucket` and `to_bucket` fields based on legacy `transaction_type`.

### Phase 3: Validation & Deprecation
1. The script automatically executes the `CFO Reconciliation Target` formula.
2. Any mismatches are output to an operations log and manually reconciled.
3. Only when 100% of accounts match, deploy the strict API constraints.
4. Old tables like `user_roles` are safely ignored.
