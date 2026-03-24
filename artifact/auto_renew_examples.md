# Auto-Renew Mechanics Explained

This document outlines exactly how the "Auto-Renew" (Reinvest Principal at Maturity) feature functions within the Funder Portfolio framework, using a standard **UGX 20,000,000** investment into the "My plan" portfolio at a flat **15% Monthly ROI**.

---

## What is Auto-Renew?
Auto-Renew is a "set it and forget it" wealth-building toggle selected during the creation of a new Rent Pool Portfolio. 

By default, when a portfolio completes its entire lease term (e.g., reaching Month 12), the portfolio "matures." The system liquidates the portfolio and deposits the original principal amount (UGX 20,000,000) back into the Funder's Available Wallet balance where it sits idle, earning no returns until manually deployed again.

**When Auto-Renew is Active:** The system intercepts this maturity event. Instead of dropping the principal into the idle wallet, it automatically rolls the matured balance over into a **brand new 12-month portfolio**, ensuring the money continues working with zero lapses in return generation.

Below are detailed examples of how this plays out across the two available Reward Modes.

---

## Scenario A: "Monthly Payout" Mode
**The Goal:** Consistent monthly passive income while protecting the original capital.

* **Principal Invested:** UGX 20,000,000
* **Reward:** 15% Monthly (UGX 3,000,000)
* **Term:** 12 Months
* **Auto-Renew:** Active

### Year 1 Lifecycle
1. **Months 1 to 12:** Every single month, the system calculates a 15% flat return on the 20M principal. The resulting **UGX 3,000,000** is deposited directly into the Funder's Wallet as liquid, immediately withdrawable cash.
2. **Total Earnings Year 1:** UGX 36,000,000 withdrawn/spent.
3. **Maturity (End of Month 12):** The 12-month term ends. The original UGX 20,000,000 principal is freed up.

### The Auto-Renew Trigger (Year 2)
Because Auto-Renew is checked, the system detects the maturity event and launches a new cycle:
1. The **UGX 20,000,000 principal** is *never* sent back to the wallet.
2. It is immediately locked into a **new 12-month portfolio**.
3. **Month 13 to Month 24:** The Funder seamlessly continues receiving their **UGX 3,000,000** monthly payouts without interruption.

---

## Scenario B: "Compounding" Mode
**The Goal:** Exponential, aggressive capital growth without taking monthly withdrawals.

* **Principal Invested:** UGX 20,000,000
* **Reward:** 15% Monthly Compounded (Profits are kept inside the portfolio)
* **Term:** 12 Months
* **Auto-Renew:** Active

### Year 1 Lifecycle
1. **Month 1:** The portfolio earns 15% (UGX 3,000,000). Nothing is paid to the wallet. Instead, the balance grows to **UGX 23,000,000**.
2. **Month 2:** The portfolio earns 15% on the *new* balance (UGX 3,450,000). The balance grows to **UGX 26,450,000**.
3. **Maturity (End of Month 12):** Due to the power of compounding, the portfolio balance has exponentially grown to exactly **UGX 107,005,681**.

### The Auto-Renew Trigger (Year 2)
Because Auto-Renew is checked, the system intercepts the massive maturity liquidation:
1. The **UGX 107,005,681 total accumulated balance** is *never* sent back to the wallet.
2. It is immediately used as the starting principal for a **new 12-month compounding portfolio**.
3. **Month 13:** The portfolio earns 15% on the entire 107M balance. The system automatically reinvests this massive **UGX 16,050,852** profit, pushing the new portfolio balance to **UGX 123,056,533**.
4. This aggressive snowball effect continues endlessly without the user ever having to manually set up new portfolios.
