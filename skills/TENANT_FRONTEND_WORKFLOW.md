# Welile: Tenant Onboarding Frontend Workflow

This document outlines the step-by-step user journey, UI elements, API interactions, and state management required for the **Tenant Onboarding Module** of the Welile rent financing platform.

## Overview
The goal is to build a scalable, mobile-first multi-step tenant onboarding flow covering the initial landing, authentication (OTP), tenant agreement, detailed application data collection, and final submission leading to the pending dashboard status.

---

## 1. Landing Page (`/`)
**Purpose:** Introduce Welile's mission, build trust, and prompt the user to start.
**UI Elements:**
- **Hero Section:** Company mission and purpose summary.
- **Trust Indicators:** 
  - Testimonials (e.g., impact stories from existing users).
  - Statistics (Live counters for "Active Tenant Pool" and "Landlords Partnered").
- **Call to Action:** `Get Started` button.

**Action (`Get Started` Click):**
- Proceeds to the **Role Selection Section**.
- Options: `Tenant`, `Agent`, `Supporter`, `Landlord`.
- Selecting `Tenant` routes the user to the Welcome Page (`/welcome`).

---

## 2. Welcome Page (`/welcome`)
**Purpose:** Reiterate the scale of the Tenant network before committing to the application.
**UI Elements:**
- **Live Statistic:** Total active tenant pool (e.g., "Join 25 Million+ Tenants").
- **Call to Action:** `Request Rent` button.

**Action (`Request Rent` Click):**
- Triggers navigation to the Sign Up Page (`/signup`).

---

## 3. Sign Up Page (`/signup`)
**Purpose:** Capture initial identity and secure the account via OTP.
**State Management:** Component-level state for form fields.
**UI Elements (Fields):**
- Full Name
- Phone Number (Used as primary identifier)
- Email (Optional)
- Password
- Confirm Password
- **Verification Trigger:** `Send OTP` button.

**OTP Workflow:**
1. User enters phone number and clicks `Send OTP`.
2. UI displays an input for the 4/6-digit OTP code.
3. User enters OTP and clicks `Verify Phone`.
4. *API Call:* `POST /auth/verify-otp` (Validates the token).
5. **Call to Action:** `Continue` button unlocks after successful OTP verify.

**Action (`Continue` Click):**
- Registers the user (`POST /auth/register`).
- Logs the user in locally (saving Auth Token/Session).
- Routes to the Tenant Agreement Page (`/tenant-agreement`).

---

## 4. Tenant Agreement Page (`/tenant-agreement`)
**Purpose:** Ensure legal and operational compliance before capturing sensitive financial data.
**UI Elements:**
- Scrollable text box displaying:
  - Tenant financing terms
  - Penalty rates
  - Privacy policy
- **Consent:** Radio button ("I agree to the terms").
- **Call to Action:** `Continue` button (disabled until radio is checked).

**Action (`Continue` Click):**
- Routes to the Multi-Step Application Form (`/tenant-onboarding`).

---

## 5. Multi-Step Application Form (`/tenant-onboarding`)
**Purpose:** Collect exhaustive profile, rent, and local verification data in manageable chunks.
**State Management:** Use a global state (e.g., Redux Toolkit, Context API, or Zustand) or LocalStorage to persist form progress in case of page refresh/abandonment.
**UI Elements:**
- **Progress Indicator:** visual bar or text (e.g., "Step X of 4").

### Step 1: Tenant and Rent Details
- **Auto-filled Fields:** 
  - Name (from Signup)
  - Phone Number (from Signup)
- **User Fields (Location/Work):**
  - Occupation
  - Work Address, Home Address
  - Village/Cell, Parish/Ward, Sub County, District
- **Rent Details:**
  - Rent Amount (UGX)
  - Rent Period (Months)
  - Rent Per Month (UGX)
- **Landlord Details:**
  - Landlord Name, Phone, Address, House/Unit Number

**Action (`Next` Click):** Validates all fields and moves to Step 2. *Recommended API Call:* `PUT /applications/{id}/step1` to persist progress.

### Step 2: Payback Calculation
- **Auto-calculated Display:**
  - **Marketplace Access Fee:** 
    - Rule 1: Rent ≤ 200,000 UGX → Fee = 10,000 UGX
    - Rule 2: Rent ≥ 200,001 UGX → Fee = 20,000 UGX
  - **Total Amount to Repay:** (Rent + Access Fee)
  - **Payback Period:** Displayed duration.
  - **Daily Repayment Amount:** (Total Repay / Payback Period).
  - *Note:* UI distinctly states: "Daily repayment starts the day after rent is paid."
- **User Fields (Landlord Next of Kin):**
  - Next of Kin Name, Next of Kin Phone, Relationship.

**Action (`Next` Click):** Validates fields, moves to Step 3. *Recommended API Call:* `PUT /applications/{id}/step2` to persist progress.

### Step 3: Identity Verification
- **Upload UI Components:**
  - National ID Front (Image)
  - National ID Back (Image)
  - Selfie Photo (Camera Capture or Image)
- **Integration Note:** Uploads hit a specific secure storage endpoint (e.g., AWS S3, Supabase Storage, or backend `/upload`) before proceeding. Display loading spinners and checkmarks upon success.

**Action (`Next` Click):** Ensures all 3 files are successfully uploaded. *Recommended API Call:* `PUT /applications/{id}/step3`.

### Step 4: Local Verification
- **Upload UI Component:**
  - LC1 Letter (PDF/Image format allowed)
- **Consent:**
  - Checkbox text: "I consent to the company storing and processing my information."
- **Call to Action:** `Complete Application`.

**Action (`Complete Application` Click):**
- Performs final upload validation.
- Submits final status and consent to the backend. *Recommended API Call:* `PUT /applications/{id}/step4`.
- Routes user to Application Status Page (`/application-status`).

---

## 6. Application Status Page (`/application-status`)
**Purpose:** Reassure the user that the process completed successfully and clarify the waiting period.
**UI Elements:**
- **Visuals:** A waiting/processing icon (e.g., Clock or Sandglass).
- **Status Banner:** `Status: Pending Approval`
- **Message:** "Your application is pending approval. Our verification team is reviewing your information."
- **Call to Action:** `Go to Dashboard`.

---

## 7. Tenant Dashboard (`/dashboard`)
**Purpose:** The central hub post-approval where tenants manage their active daily rent.
**UI Elements:**
- **Top Metrics:**
  - Rent Financed (Principal)
  - Total Repayment Amount (Principal + Fees)
  - Daily Repayment Amount
- **Progress Trackers:**
  - Remaining Balance
  - Next payment date / amount due today.
- **Lists / Actions:**
  - Payment History (Chronological layout of daily deposits).
  - **Call to Action:** `Pay Now` button for manual Mobile Money push requests.

---

## Key Non-Functional Requirements (NFRs)
- **Responsiveness:** Entire flow must be mobile-first optimized (stacking inputs, large tap targets, no horizontal scrolling).
- **Core Stack Integration:** Components will primarily use **React/Next.js**, while targeted DOM manipulation, animations, or legacy plugin integrations will utilize **jQuery**.
- **Resilience:** If the user drops off at Step 2, returning to `/tenant-onboarding` must restore Step 2 from backend drafted state.
- **Form Validation:** Strict regex for Phone Numbers (Ugandan format) and file size limits for image uploads (e.g., Max 5MB per document).
- **Currency Format:** Ensure all monetary outputs are formatted correctly in **UGX** with comma separator.
