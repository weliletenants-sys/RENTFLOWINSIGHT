# FINANCIAL INTEGRITY AUDIT REPORT
## Welile Technologies — General Ledger & Wallet System
### Date: 2026-04-09 | Classification: CRITICAL

---

## 1. EXECUTIVE SUMMARY

| Finding | Severity | Risk |
|---------|----------|------|
| 89.7% of ledger entries lack `transaction_group_id` | **CRITICAL** | Double-entry is not enforced; ledger is single-entry in practice |
| System-wide wallet-ledger drift of **UGX 81.3M** | **CRITICAL** | Wallets hold 81.3M more than ledger says users should have |
| ROI paid out (186.2M) exceeds capital deployed (121.2M) by **53.6%** | **CRITICAL** | Platform is paying returns exceeding invested capital |
| 442 users have negative ledger balances totaling **-130.2M** | **HIGH** | Ledger truth is structurally corrupted for 62% of ledger users |
| 3 database triggers directly mutate `wallets.balance` bypassing ledger | **CRITICAL** | Breaks the "ledger as source of truth" guarantee |
| `sync_wallet_from_ledger` ignores `credit`/`debit` directions | **HIGH** | Any entry using modern directions is invisible to wallet cache |
| Duplicate ROI payouts detected (1 user, 14 entries, no source_id) | **HIGH** | Uncontrolled ROI disbursement |
| Platform scope shows **-47.8M net** | **CRITICAL** | Platform is recording more expenses than revenue |
| Approved withdrawals (23.4M) ≠ ledger withdrawal entries (57.5M) | **CRITICAL** | 34M in phantom withdrawals exist in ledger |

**Bottom line**: The system does not have functioning double-entry accounting. The general ledger is an append-only single-entry log with no enforced balancing. The wallet cache has drifted 81.3M above ledger truth due to multiple bypass paths. ROI payouts are not tied to actual revenue and exceed deployed capital.

---

## 2. ROOT CAUSE ANALYSIS

### Architectural Causes

**A. Double-Entry Is Not Enforced**
Despite the stated policy of double-entry, **89.7% of entries (9,382 of 10,461)** have no `transaction_group_id`. Of the 735 groups that exist, only **53 are balanced** (7.2%). 682 groups are unbalanced. 299 groups are credit-only. 132 are debit-only. The deferred constraint trigger mentioned in governance docs either does not exist or is not functioning.

**B. Direction System Inconsistency**
The system uses ONLY `cash_in` (6,604 entries) and `cash_out` (3,857 entries). Zero entries use `credit` or `debit` directions in the wallet scope. However, the `get_agent_split_balances` RPC handles both `credit`/`cash_in` and `debit`/`cash_out` — this is forward-compatible but reveals the system has never transitioned to proper debit/credit accounting.

**C. Three Competing Balance Writers**

| Writer | Mechanism | Ledger Entry? | Double-Entry? |
|--------|-----------|---------------|---------------|
| `sync_wallet_from_ledger` trigger | On ledger INSERT → updates wallet | N/A (reads ledger) | No |
| `sync_agent_wallet_on_earning` trigger | On agent_earnings INSERT → directly `wallets.balance + amount` | Separate trigger writes ledger | No — wallet write is independent |
| `deduct_wallet_on_withdrawal_request` trigger | On withdrawal_requests INSERT → directly `wallets.balance - amount` | **None** | **None** |

The withdrawal deduction trigger is the most dangerous: it deducts from wallets on request creation but **never creates a ledger entry**. The ledger entry only appears later (or not at all), creating permanent drift.

### Data-Level Causes

**D. Wallet Clamping Creates Phantom Value**
`sync_wallet_from_ledger` uses `GREATEST(balance - amount, 0)` for cash_out. This means if a user has 100 UGX and a 500 UGX cash_out is inserted, the wallet becomes 0 but the ledger records -400. Repeated application creates unbounded negative ledger positions while wallet stays at 0.

`enforce_non_negative_balance` trigger ALSO clamps: if `NEW.balance < 0` → set to 0. This is a second safety net that masks the drift.

**E. Agent Earnings Double-Credit**
When an agent earning is inserted (types not in referral_bonus/commission/subagent_commission):
1. `sync_agent_wallet_on_earning` → directly adds to `wallets.balance`
2. `log_agent_earning_to_ledger` → inserts `cash_in` into general_ledger
3. `sync_wallet_from_ledger` → fires on that ledger insert → adds to `wallets.balance` AGAIN

This is a **confirmed double-credit bug** for earning types: `verification_bonus` (155K), `rent_funded_bonus` (65K), `proxy_investment_commission` (49.7K), `approval_bonus` (35K), `listing_bonus` (30K). Total double-credited: **~336,659 UGX** across 66 entries.

---

## 3. ISSUE BREAKDOWN

### 3.1 Negative Balances (442 users, -130.2M total)

**Cause**: Ledger records unbounded cash_out while wallet clamps at 0. Over time, repeated deductions on zero-balance wallets (daily charges, rent obligations, test cleanups) create massive negative positions.

**Top affected**:
| User | Ledger Net | Wallet | Drift |
|------|-----------|--------|-------|
| Grace Paul Ochieng | -83,635,004 | 424 | 83.6M |
| Nankambo | -6,086,400 | 0 | 6.1M |
| Kabahuma Lillian | -4,800,000 | 0 | 4.8M |
| Benjamin Muhanguzi | -3,639,000 | 772,800 | 4.4M |
| Mercy Bayo | -3,000,000 | 0 | 3.0M |

**Grace Paul breakdown**: 86.8M `test_funds_cleanup` + 45.6M `wallet_withdrawal` cash_out vs ~50M total deposits. The `test_funds_cleanup` category alone accounts for 87.7M system-wide in outflows from just 3 entries — this is a data administration action that was not offset.

**Benjamin breakdown**: 4.5M `coo_proxy_investment` cash_out vs ~1M inflows. Investment outflows exceeded deposits.

### 3.2 Inflated Balances (Wallet > Ledger)

**Total system inflation: UGX 81,341,744**
- Total wallet balances: 89,312,417
- Total ledger net: 7,970,673
- **Drift: wallets hold 81.3M more than the ledger says should exist**

**Notable inflations**:
| User | Wallet | Ledger | Inflation |
|------|--------|--------|-----------|
| Grace Paul Ochieng | 424 | -83,635,004 | 83.6M (clamped) |
| Benjamin Muhanguzi | 772,800 | -3,639,000 | 4.4M |
| ATUHAIRE CAROLYNE | 20,109,233 | 18,992,830 | 1.1M |
| Lukodda Joseph | 1,434,000 | 234,000 | 1.2M |
| Ssenyondo Sharif | 77,128 | 0 | 77K (no ledger at all) |
| Test Man | 50,000 | 0 | 50K (no ledger at all) |

Users like Ssenyondo Sharif and Test Man have wallet balances with **zero ledger entries** — money created from nowhere, likely via direct wallet mutations.

### 3.3 ROI Overpayments

| Metric | Amount |
|--------|--------|
| ROI credited to supporter wallets | 186,243,231 |
| Capital deployed for rent | 121,236,593 |
| ROI as % of capital | **153.6%** |
| Platform revenue (platform scope) | ~115,088 |
| ROI vs platform revenue | **1,617x** |

**Finding**: ROI payouts of 186.2M have been made against only 121.2M in deployed capital and only ~115K in platform-scope revenue. The ROI engine is disconnected from actual revenue generation.

**Duplicate ROI payouts**: User `b4d7c324` (LUKODDA JOSEPH) received **14 ROI entries with NULL source_id** totaling 8.4M, plus additional duplicates per portfolio. A single "backfill" operation on 2026-04-07 credited massive lump sums (49M, 9.9M, 5M, 2.5M) described as "Proxy partner investment credit on approval (backfill)."

### 3.4 Category Misuse

| Category | Issue |
|----------|-------|
| `test_funds_cleanup` | 87.7M cash_out / 5.6M cash_in. Net -82.1M. Used for operational data admin with no offsetting entries |
| `wallet_deduction_general_adjustment` | 56.6M in outflows. No corresponding cash_in adjustments |
| `wallet_deduction_cash_payout_retraction` | 66.6M in outflows. Retractions recorded as ledger cash_out but wallets already adjusted externally |
| `reconciliation` | 23.1M cash_in. Single entry. No paired debit |
| `roi_payout` | Used for both actual ROI and "backfill" corrections — conflates operational fixes with genuine payouts |
| `balance_correction` | 12.9M cash_out / 560K cash_in. Corrections are net-negative, making the problem worse |

### 3.5 Phantom Withdrawals

- Approved withdrawals (withdrawal_requests table): **23,356,050**
- Ledger withdrawal entries (`wallet_withdrawal` cash_out): **57,455,695**
- **Gap: 34,099,645 in ledger withdrawal entries that don't correspond to approved withdrawal requests**

This means either: (a) the ledger contains withdrawal entries for rejected/cancelled requests that were never reversed, or (b) withdrawal entries are being created outside the withdrawal_requests flow.

---

## 4. FLOW-LEVEL FINDINGS

### 4.1 Deposit → Wallet
**Status**: Partially broken
- Deposits (209.2M cash_in) correctly pass through ledger
- `sync_wallet_from_ledger` trigger updates wallet on cash_in ✓
- **Issue**: Some deposits may trigger `approve-wallet-operation` which does auto-repayment via additional ledger entries — these are ledger-safe

### 4.2 Withdrawal → Cash Out
**Status**: BROKEN
- `deduct_wallet_on_withdrawal_request` trigger deducts wallet balance **immediately on request creation**
- No ledger entry is created at this point
- If the withdrawal is later rejected, `handle_withdrawal_approval` says "do NOT refund. Money stays deducted"
- The ledger entry for `wallet_withdrawal` appears to be created separately (by an edge function or other trigger)
- **Result**: Wallet is deducted without ledger, and rejected withdrawals permanently lose money from the wallet

### 4.3 Agent Earnings → Wallet
**Status**: BROKEN (Double-credit)
- `sync_agent_wallet_on_earning` directly credits wallet for non-referral types
- `log_agent_earning_to_ledger` inserts ledger entry
- `sync_wallet_from_ledger` fires on that insert and credits wallet AGAIN
- **Result**: Every qualifying agent earning is credited twice to the wallet

### 4.4 ROI Payout → Supporter Wallet
**Status**: BROKEN (No revenue linkage)
- ROI is calculated as flat monthly % of principal
- No validation against actual rent collections or platform revenue
- Backfill operations inject massive lump sums
- **Result**: Platform pays more in ROI than it earns, creating unfunded obligations

### 4.5 Rent Repayment → Revenue
**Status**: Partially working
- `sync_collection_to_ledger` trigger splits daily charges into revenue categories ✓
- But revenue is recorded in `wallet` scope (10.7K `rent_principal_collected`, 8.2K `access_fee_collected`)
- Platform-scope revenue is minimal (115K total `tenant_access_fee`)
- **Result**: Revenue recognition exists but at trivially small amounts vs obligations

---

## 5. DATA INTEGRITY FINDINGS

| Metric | Value |
|--------|-------|
| Total ledger entries | 10,461 |
| Entries missing `transaction_group_id` | 9,382 (89.7%) |
| Transaction groups that are balanced | 53 of 735 (7.2%) |
| Users with negative ledger balances | 442 of 709 (62.3%) |
| Total negative position | -130,208,674 UGX |
| System wallet-ledger drift | +81,341,744 UGX |
| Users with wallet > 0 but no ledger entries | Multiple confirmed |
| Duplicate ROI payouts | At least 1 user with 14+ duplicates |
| Agent earnings double-credited | ~66 entries, ~337K UGX |
| Phantom withdrawal entries | 34.1M UGX |

---

## 6. RISK ASSESSMENT

### Liquidity Risk: CRITICAL
- Total wallet balances (89.3M) represent what users believe they can withdraw
- Total ledger net (8.0M) represents what the system actually tracks as available
- **Gap of 81.3M = unfunded user expectations**
- If all users attempted to withdraw, there is an 81.3M shortfall

### Financial Exposure: CRITICAL
- ROI obligations (186.2M paid, ongoing monthly) are not backed by revenue (115K)
- Platform net position is -47.8M
- 442 users have corrupted ledger positions that cannot be reconciled without manual intervention

### Audit Risk: CRITICAL
- 89.7% of entries lack grouping — no audit trail for paired entries
- Multiple categories used for ad-hoc corrections without standards
- `test_funds_cleanup` used to remove 87.7M with no approval trail
- Backfill operations injected 70M+ in a single batch with identical timestamps

---

## 7. RECOMMENDATIONS (HIGH-LEVEL)

1. **Double-entry must actually be enforced** — every entry needs a balancing counterpart, and the deferred constraint must reject unbalanced groups

2. **Eliminate all direct wallet mutations** — the three triggers that bypass the ledger must be restructured to write through the ledger only

3. **The `sync_wallet_from_ledger` trigger must handle all four directions** (credit, debit, cash_in, cash_out) to remain the single wallet writer

4. **ROI engine must be gated by actual revenue** — payouts should never exceed what the platform has actually collected

5. **Withdrawal flow must create a ledger entry at request time** — and refund on rejection, not "stay deducted"

6. **Agent earnings double-credit must be eliminated** — either the direct wallet trigger or the ledger-based trigger should exist, not both

7. **Historical reconciliation is required** — the 442 negative balances and 81.3M system drift need correction entries

8. **Category governance must be enforced** — ad-hoc categories like `test_funds_cleanup` and `reconciliation` should be prohibited or require multi-party approval

9. **The platform scope must actually record revenue** — currently near-zero, while wallet-scope records the actual activity

10. **Idempotency keys must be enforced for all payouts** — especially ROI, to prevent duplicate disbursement

---

*This report is diagnostic only. No code or data has been modified.*

*Auditor: System Analysis Engine*
*Date: 2026-04-09*
