Use this as a **backend development skill instruction** for your AI agent. It enforces structure, security, and production-grade practices for Welile.

---

# Backend Skill: Secure Fintech API Development (Welile)

## Purpose

Build a **secure, scalable, and maintainable backend** for Welile (real estate investment platform) using best practices in:

* API design
* Data integrity
* Security
* Performance
* Financial correctness

The backend must prioritize **accuracy, security, and auditability** over convenience.

---

## Core Principles

1. **Financial Accuracy First**

* Never approximate financial values
* Use precise calculations (no floating-point errors; use decimals)
* All computed values must be reproducible

2. **Single Source of Truth**

* Do NOT store derived values unnecessarily
* Example:

  * Store transactions, investments
  * Compute portfolio value from them

3. **Deterministic Systems**

* Same input → same output always
* Avoid hidden state or inconsistent calculations

---

## Architecture Guidelines

* Use **layered architecture**:

  * Controller (HTTP handling)
  * Service (business logic)
  * Repository (data access)

* Keep logic out of controllers

* Follow **RESTful API design**

* Use consistent naming:

  * `/portfolios`
  * `/portfolios/{id}/investments`

---

## Data Modeling (Critical)

### Entities

**Users**

* id, email, password_hash

**Portfolios**

* id, user_id, name, code, status

**Investments**

* id, portfolio_id, asset_id, amount_invested

**Transactions**

* id, user_id, type (deposit/withdrawal), amount

**DailyReturns**

* id, investment_id, date, profit_amount

---

## Financial Logic Rules

1. **Portfolio Value**

```
SUM(all investment current values)
```

2. **Invested Amount**

```
SUM(all investment principal)
```

3. **Today’s Growth**

```
SUM(daily_returns.profit_amount WHERE date = today)
```

STRICT RULE:

* Must NOT include deposits/withdrawals

---

## Input Validation & Sanitization

### Always enforce:

* Validate all inputs:

  * Required fields
  * Data types
  * Value ranges

* Sanitize inputs:

  * Trim strings
  * Escape special characters
  * Prevent script injection

### Example Rules:

* Email → valid format
* Amount → numeric, positive
* Portfolio name → length limit (e.g., 3–100 chars)

---

## SQL Injection Prevention

* NEVER use raw queries with user input
* ALWAYS use:

  * Prepared statements
  * ORM

---

## Authentication & Authorization

* Use **token-based authentication** (JWT)

* Enforce:

  * Authenticated routes
  * Ownership checks:

    * A user can only access their own portfolios

Example:

```
if (portfolio.user_id !== auth_user.id) → deny
```

---

## Rate Limiting

Apply rate limiting to prevent abuse:

* Login → strict (e.g., 5 attempts/minute)
* API endpoints → moderate (e.g., 60 requests/minute)

Protect:

* Auth endpoints
* Financial actions (deposit, withdraw)

---

## Error Handling

* Never expose internal errors
* Return structured responses:

```json
{
  "status": "error",
  "message": "Invalid input"
}
```

* Log real errors internally

---

## Logging & Auditing (CRITICAL)

Track all financial actions:

* Deposits
* Withdrawals
* Investment creation

Log:

* user_id
* action
* timestamp
* amount

Ensure logs are:

* immutable
* traceable

---

## Security Best Practices

* Hash passwords using **bcrypt/argon2**

* Use HTTPS only

* Prevent:

  * XSS (escape outputs)
  * CSRF (tokens)
  * SQL injection

* Never expose:

  * raw database errors
  * stack traces

---

## Concurrency & Data Integrity

Use:

* Database transactions for financial operations

Example:

* Creating investment:

  * Deduct wallet balance
  * Create investment
    → Must succeed or fail together

---

## API Response Standards

All responses must follow:

```json
{
  "status": "success",
  "data": {},
  "message": ""
}
```

---

## Performance Optimization

* Use indexing:

  * user_id
  * portfolio_id

* Avoid N+1 queries

* Use eager loading where necessary

---

## Code Quality

* Use:

  * Clear naming
  * Small functions
  * Reusable services

* Follow:

  * DRY (Don’t Repeat Yourself)
  * SOLID principles

---

## Testing (Required)

* Unit tests for:

  * Financial calculations
* Feature tests for:

  * API endpoints

---

## Prohibited Practices

* ❌ Mixing business logic in controllers
* ❌ Using floats for money
* ❌ Trusting client-side values
* ❌ Skipping validation
* ❌ Hardcoding values

---

## Expected Outcome

The backend must:

* Be secure against common attacks
* Handle financial data correctly
* Scale with multiple users and portfolios
* Provide clean, reliable APIs for frontend use

---

# SECURITY

ensure token are regenerated and validated on every login and logout and also ensure that the token is stored in the database and can be revoked at any time