# Super Admin Dashboard — Workflow & Feature Guide

> **Last Updated:** March 2026  
> **Access:** Super Admin  
> **Route:** `/admin/dashboard`

---

## Overview

The Super Admin Dashboard is the highest level of administrative control in Welile Technologies Limited. It provides system-wide administration, full access to all manager features, deep system configuration, role assignment capabilities, and comprehensive audit oversight. This dashboard acts as the final escalation point for system governance and technical support operations.

---

## Access & Navigation

| Method | Path |
|--------|------|
| Direct URL | `/admin/dashboard` |
| Admin Hub | Admin Login Portal → Role Selection |

**Allowed Roles:** `SUPER_ADMIN`

---

## Capabilities & Permissions

Because `SUPER_ADMIN` acts as the system's root user, it inherits all permissions from the `MANAGER` role and adds several critical overlays:

1. **Role Assignment & Revocation:** Ability to grant or remove any executive or administrative role to a user.
2. **Account Governance:** Complete capabilities to freeze, suspend, or permanently delete user accounts and clear their data.
3. **Role Impersonation:** Native integration with the `RoleSwitcher` component to view the system through the lens of any other role (e.g., verifying what a Tenant or Agent sees without asking for their credentials).
4. **System Configuration:** Access to global environment variables, feature flags, and global rate limits or cooldowns.

---

## Sidebar Sections

The Super Admin dashboard uses a structured sidebar layout with the following sections:

### Administration Section

| Tab | Description |
|-----|-------------|
| **Dashboard Access** | Entry point to access all subordinate executive dashboards |
| **User Management** | Advanced user CRUD operations, role assignment, account unfreezing/deletion |
| **Audit Logs** | Infinite scrolling/paginated view of `audit_logs` and administrative actions |
| **System Config** | Feature flags, global variables, and system health status |

---

## Dashboard Access (Default View)

### Executive Portals Hub

Rather than duplicating the charts of other executives, the default view provides direct access "portals" to explore the platform through specialized executive views.

| Portal | Action | Description |
|--------|--------|-------------|
| **CEO Dashboard** | `Navigate to /ceo/dashboard` | Review platform health, growth trajectory, staff accountability |
| **COO Dashboard** | `Navigate to /coo/dashboard` | Manage transactions, withdrawals, and agent collections |
| **CFO Dashboard** | `Navigate to /cfo/dashboard` | Review financial statements, solvency, ledger integrity |
| **CTO Dashboard** | `Navigate to /cto/dashboard` | Review infrastructure, API limits, security incidents |
| **Manager Hub** | `Navigate to /dashboard` | Standard manager operations, rent/deposit approvals |

Each portal acts as a deep link. Because `SUPER_ADMIN` is whitelisted across all role guards, the transition is seamless.

---

## User Management Tab

This section extends the standard manager's view with destructive and high-security capabilities.

### Features
- **Advanced Global Search:** Search across all `profiles`, `user_roles`, and `wallets`.
- **Role Assignment Console:** Assign executive roles (`CEO`, `COO`, etc.) requiring a Super Admin authorization pin or MFA confirmation.
- **Account Freeze/Delete Panel:** Hard-freeze accounts for fraud investigation. Delete accounts (soft-delete or GDPR-compliant hard delete) with cascaded relationship warnings.
- **Impersonation Action:** Launch the `RoleSwitcher` context specifically localized to a selected user's profile to debug exactly what they are experiencing.

---

## Audit Logs Tab

A complete, immutable ledger of all administrative actions taken by any Manager or Executive across the platform.

### Data Columns
- **Timestamp** — When the action occurred
- **Actor** — The Staff member/Executive who performed the action
- **Action Type** — e.g., `ROLE_ASSIGNED`, `DEPOSIT_APPROVED`, `WITHDRAWAL_REJECTED`
- **Target** — The user ID or entity affected
- **IP Address & Metadata** — Security context of the action

**Filters available:** Date Range, Actor Role, Action Type, Target User.

---

## System Config Tab

A command-center interface for non-developer system tuning.

### Capabilities
- **Feature Flags:** Toggle new platform features (e.g., "Suspend Wallet-to-Wallet Transfers", "Enable Holiday Promo UI").
- **Financial Thresholds:** Adjust standard limits (e.g., Maximum allowed proxy investment before manual review).
- **Maintenance Mode:** Ability to set the platform to read-only or maintenance mode, broadcasting an alert to all active sessions.

---

## Data Architecture & Security

### Security Overlays
- **MFA Required:** All destructive actions (Delete User, Freeze Account) or high-risk actions (Assign Executive Role, System Config changes) require an re-verification prompt (MFA or Admin Pin).
- **Log Everything:** Every action a `SUPER_ADMIN` takes writes a high-priority event to the `audit_logs` table. `SUPER_ADMIN` actions cannot be scrubbed.

### Component Structure Overview
- `SuperAdminDashboardLayout.tsx` — Main wrapper with Super Admin sidebar.
- `SuperAdminOverview.tsx` — The Executive Portals Hub.
- `SuperAdminUserManagement.tsx` — The elevated user management table and assignment tools.
- `SuperAdminAuditLogs.tsx` — The paginated audit trail.
- `SuperAdminSystemConfig.tsx` — Status toggles and thresholds.

---

## Related Documents

- [System Structure](./SYSTEM_STRUCTURE.md) — Technical architecture and role parity
- [Executive Hub Guide](./EXECUTIVE_HUB_GUIDE.md) — Sibling executive roles
