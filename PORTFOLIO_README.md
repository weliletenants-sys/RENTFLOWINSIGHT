# Welile Portfolio & Investment Logic

This document outlines the core business rules and user flows for how Supporters (Funders) interact with their capital on the Welile platform. 

---

## 1. The Core Mechanic: The Rent Management Pool
Supporters **do not** individually pick or fund specific houses. All supporter capital is aggregated into a central **Rent Management Pool**.

*   **Why?** This allows Welile Managers to deploy capital efficiently across approved tenant rent deals without being bottlenecked by individual funder preferences.
*   **The Supporter View:** Supporters simply create "Portfolios" (e.g., "Retirement Fund"). They choose how much to contribute to the central pool and set the terms (Duration & Reward Mode).

## 2. Virtual Properties
To maintain the feeling of real estate ownership without the logistical nightmare of direct matching, Welile uses **Virtual Properties**.

*   Once a Supporter funds a Portfolio, the system automatically assigns them anonymized representations of actual active rent deals (e.g., *Makindye Unit B12*). 
*   These are strictly for visual representation and transparency, showing the Supporter exactly where their impact is felt on the ground. The word "Investment" is strictly avoided in favor of "Pool Contribution" or "Virtual Property".

---

## 3. Reward Modes
When creating a Portfolio, Supporters choose how they want their ROI (Return on Investment) handled.

### A. Monthly Payout
*   **How it works:** Every month, the generated profit is sent straight to the Supporter's Wallet as liquid cash. 
*   **The Principal:** The original seed money remains locked in the Rent Pool until the end of the duration (Maturity).

### B. Compounding
*   **How it works:** Monthly profits are *not* sent to the wallet. Instead, they are automatically reinvested back into the Portfolio's principal.
*   **The Result:** The principal grows every month, meaning the subsequent month's percentage yield calculates off a larger base amount, dramatically accelerating wealth growth.

---

## 4. The Auto-Renew Feature
At the end of a Portfolio's term (e.g., 12 months), the principal reaches **Maturity**. Supporters can toggle an **Auto-Renew** feature when creating the Portfolio to determine what happens at Maturity.

### Without Auto-Renew
At Maturity, the Portfolio is closed. The locked Principal is released and deposited into the Supporter's Wallet as liquid cash.

### With Auto-Renew Enabled
*   **If on Monthly Payout:** The system continues sending monthly profits to the Wallet. At Maturity, instead of returning the Principal to the Wallet, the system **automatically rolls over the Principal** into a brand new term. *Result: An endless, passive income stream.*
*   **If on Compounding:** Both the Principal and all the accumulated compounded profits are automatically rolled over into a brand new term. *Result: Aggressive, uninterrupted, long-term wealth building.*

---

## 5. UI / UX Principles
1.  **Strictly Numbers:** All currency inputs enforce numeric bounds and actively prevent users from typing more than their available Wallet Balance.
2.  **Live Deduction Calculations:** When adding a new Portfolio, the UI dynamically calculates the remaining Wallet Balance on the fly and provides visual warnings (red text) if the balance hits zero.
3.  **Complete Transparency:** Dedicated Portfolio Detail pages list out every Virtual Property assigned to the pool contribution and maintain a strict Payout History table logging every transaction date, type, and amount.
