## CFO Dashboard Workflow (`/cfo/dashboard`)

**Who:** Chief Financial Officer
**Purpose:** Centralized financial governance, reconciliation, and fiscal oversight

---

### Sidebar Navigation (6 tabs)

#### 1. Overview (`id: overview`)
- **Entry point** — high-level financial health snapshot
- KPI cards showing: Total Platform Revenue, Total Capital Deployed, Outstanding Receivables, Wallet balances
- Summary charts for revenue trends and cash flow

#### 2. Financial Statements (`id: statements`)
- Income statement view: Revenue (platform fees, access fees) vs. Expenses (commissions, ROI payouts)
- Balance sheet indicators: Assets (rent receivables, wallet balances) vs. Liabilities (investor capital, pending withdrawals)
- Figures ≥100K displayed in **CompactCurrency** format (e.g., 3.5M, 120K) with tooltips for full values
- **CSV export** for offline auditing

#### 3. Solvency & Buffer (`id: solvency`)
- **Coverage Ratio** monitoring (target: >1.2x)
- Platform buffer health: available liquidity vs. outstanding obligations
- Solvency alerts when ratio drops below threshold
- Breakdown: Total Funded vs. Total Repaid vs. Outstanding Balance

#### 4. Reconciliation (`id: reconciliation`)
- **Gap Detection Engine**: compares `wallets.balance` against `general_ledger` totals (sum of cash_in minus cash_out)
- Batch-fetching for profile data to bypass the 1,000-row limit at production scale
- Flags discrepancies between wallet balances and ledger records
- Each gap shows: User, Wallet Balance, Ledger Balance, Difference
- Filterable and sortable by discrepancy size

#### 5. General Ledger (`id: ledger`)
- Full transactional history from `general_ledger` table
- Filterable by: category (platform_fee, commission, deposit, withdrawal, roi_payout), direction (credit/debit), date range
- Columns: Date, Description, Category, Direction, Amount, Running Balance
- Searchable by reference ID or linked party

#### 6. Commission Payouts (`id: commissions`)
- Agent commission payout queue from `agent_commission_payouts`
- Status workflow: **Requested → Approved → Processed** (or Rejected)
- CFO sign-off is a **mandatory gate** before disbursement
- Shows: Agent Name, Amount, Mobile Money Number/Provider, Status, Transaction ID
- Rejection requires a reason logged to `rejection_reason`

#### 7. Withdrawals (`id: withdrawals`)
- Investment withdrawal requests from `investment_withdrawal_requests`
- Status workflow: **Pending → Approved → Processed** (or Rejected)
- CFO sign-off required before processing
- Shows: User, Amount, Reason, Earliest Process Date, Rewards Paused status
- All approvals/rejections logged with `processed_by` and timestamp

---

### Governance Rules
- **All administrative actions** require a mandatory 10-character audit reason
- Every action logged to `audit_logs` table (user_id, action_type, metadata, timestamp)
- CFO sign-off is required for: ROI payouts, commission disbursements, and withdrawal approvals
- CompactCurrency formatting used throughout for readability at scale
