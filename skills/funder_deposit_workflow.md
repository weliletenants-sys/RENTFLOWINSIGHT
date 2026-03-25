# Funder Deposit Workflow — Full Breakdown

## Entry Point
The funder taps **"Deposit"** on the **Partner Wallet Widget** (`PartnerWalletWidget.tsx`), which opens the `DepositFlow` dialog.

---

## Step 1 — Select Deposit Channel
The user chooses **how** they deposited money. Three options:

| Channel | Description | Visual |
|---------|-------------|--------|
| **Mobile Money** | MTN MoMo or Airtel Money merchant payment | Yellow border |
| **Bank Transfer** | Equity Bank Uganda direct deposit | Blue border |
| **Agent Cash** | Paid cash to a Welile field agent | Green border |

Tapping a channel advances to the **form step**.

---

## Step 2 — Channel-Specific Instructions

### If Mobile Money:
1. **How-to guide** displayed: Dial `*165#` (MTN) or `*185#` (Airtel) → Pay Bill → Enter merchant code → Confirm.
2. **Provider selector**: Two branded radio buttons — **MTN** (yellow circle) or **Airtel** (red circle).
3. **Merchant code display**: Shows `090777` (MTN) or `4380664` (Airtel) in large monospace font, with the merchant name **"WELILE TECHNOLOGIES LIMITTED"**.

### If Bank Transfer:
- Displays full bank details in a styled card:
  - **Bank**: Equity Bank Uganda
  - **Branch**: Entebbe Branch
  - **Account Name**: WELILE TECHNOLOGIES LIMITED
  - **Account Number**: `1046203375259`
  - **Currency**: UGX
  - **SWIFT Code**: `EQBLUGKA`

### If Agent Cash:
- Shows instructions to enter the **receipt number** from the physical receipt the agent provided.

---

## Step 3 — Enter Amount
- Manual input field (minimum UGX 500).
- **Quick amount chips**: UGX 50,000 / 100,000 / 250,000 / 500,000 for one-tap entry.
- Selected chip highlights with `variant="default"`.

---

## Step 4 — Enter Reference ID

| Channel | Field Label | Prefix | Input Mode |
|---------|-------------|--------|------------|
| MoMo | Transaction ID | `TID` | Numeric only |
| Bank | Bank Reference Number | `TID` | Alphanumeric |
| Agent Cash | Receipt Number | `RCT` | Text |

- For **Agent Cash**, an additional **"Agent Name"** field is required.
- The reference is normalized: `TID` + uppercase input (MoMo/Bank) or `RCT` + uppercase input (Agent Cash).

### Duplicate Detection (MoMo/Bank — `DepositDialog` variant):
- **Debounced real-time check**: After typing ≥5 characters, a 600ms debounce triggers a query against `deposit_requests` matching the first 5 characters.
- Shows one of three states:
  - ⏳ "Checking transaction ID..." (spinner)
  - ✅ "Transaction ID is valid" (green)
  - ❌ "This transaction ID has already been submitted" (red, blocks submission)

### Duplicate Detection (`DepositFlow` variant):
- Full exact-match check at submission time against the normalized reference. If found, blocks with a toast error.

---

## Step 5 — Select Date & Time
- **Date picker**: Restricted to the **last 7 days** (no future dates allowed).
- **Time picker**: Standard time input.
- Validation: If the combined date+time is in the future or older than 7 days, submission is blocked with an error toast.

---

## Step 6 — Reason / Narration
- **Required text field** — the user must explain why they're depositing (e.g., "Wallet top-up", "Investment capital").
- For Agent Cash, the agent's name is appended to the notes automatically.

---

## Step 7 — Bank Slip Upload (Bank Transfer Only)
- Optional **file upload** button for bank transfer deposits.
- Accepted formats: Any image/document file.
- Uploaded to **Lovable Cloud storage** at path `deposit-proofs/bank-slips/{user_id}/{timestamp}.{ext}`.
- The public URL is appended to the deposit notes.

---

## Step 8 — Submission
When the user taps **"Submit Deposit Request"**:

1. **Validation pass**: Amount > 0, reference filled, date/time valid, reason filled, no duplicate TID.
2. **Loading state**: A full-screen spinner replaces the form ("Submitting...").
3. **Database insert**: A record is created in `deposit_requests` with:
   - `user_id`, `amount`, `status: 'pending'`, `provider` (mtn/airtel/bank_transfer/agent_cash), `transaction_id` (normalized), `transaction_date`, `notes`.
4. **Pre-registered TID auto-match** (automatic approval path):
   - The system checks the `pre_registered_tids` table for a matching TID with status `'waiting'`.
   - It tries 3 variants: full normalized ref, without prefix, and raw input.
   - If a match is found **AND** the amount matches (within UGX 1 tolerance):
     - The `approve-deposit` Edge Function is invoked to **instantly approve** the deposit.
     - The pre-registered TID record is updated to `status: 'matched'` with the deposit ID and timestamp.
     - User sees: **"Deposit verified automatically!"** ✅
   - If no pre-registered match: **"Deposit submitted for verification"** (enters manual queue).

---

## Step 9 — Success Screen
- Large green checkmark animation.
- Message: **"Request Submitted!"** with the deposit amount displayed.
- Two buttons:
  - **"Done"** — closes the dialog and resets all form state.
  - **"View Deposit History"** / **"View History"** — navigates to `/deposit-history`.

---

## Post-Submission: Manager Verification Pipeline

```text
User submits deposit → Record created as 'pending' in deposit_requests
       ↓
COO Notification → COO receives the new pending deposit alert
       ↓
COO Review → COO clicks to see the full transaction details and slip
       ↓
COO Forwarding → Once reviewed, the COO forwards/escalates the deposit for final approval
       ↓
CFO Final Confirmation → The CFO reviews the details and confirms/approves the deposit
       ↓
On final approval → Wallet balance credited via double-entry ledger update
```

---

## Key Safety Features
| Feature | Detail |
|---------|--------|
| **Duplicate TID prevention** | Real-time debounced check + DB unique constraint (`23505` error code caught) |
| **7-day window** | Transactions older than 7 days are rejected |
| **No future dates** | Date picker max = today |
| **Mandatory reason** | Every deposit must have a narration for audit trail |
| **Pre-registered TID auto-match** | Operators can pre-register TIDs from bank/MoMo statements; when a user submits a matching TID+amount, it's approved instantly without manual review |
| **Pending until verified** | No wallet credit until manager/system approves — funds are custodial |
| **Ledger-backed** | Approval triggers the `approve-deposit` Edge Function which creates double-entry ledger records before crediting the wallet |
