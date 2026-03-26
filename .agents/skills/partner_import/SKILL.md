---
name: COO Partner Import Configuration
description: Rules and guidelines for how imported COO partners receive default system configurations.
---

# COO Partner Import Guidelines

When generating backend implementation logic or scripts for importing and onboarding new partners/funders via the bulk importing system, ALWAYS adhere to the following system requirements:

1. **Default Password Protocol**:
   All dynamically created imported partner accounts must automatically be assigned the exact default password `Partner@welile`.
   This must be encrypted using standard `bcrypt` hashing (salt rounds: 12) inside the backend controller, mapped to the `password_hash` field before database insertion.

2. **Direct Authentication Bypass**:
   Because the password hash is properly linked during creation, newly imported users can immediately log into the web or mobile app strictly using the default password alongside either their registered phone number or registered email address. No secondary "activation link" is required to gain entry.

3. **Account Integrity Attributes**:
   Imported users must be strictly cast to the `FUNDER` role with properties:
   - `verified: true`
   - `is_frozen: false`
   - `rent_discount_active: false`
