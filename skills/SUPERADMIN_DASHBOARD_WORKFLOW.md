# Super Admin Dashboard — Workflow & Feature Guide

> **Last Updated:** March 2026  
> **Access:** Super Admin  
> **Route:** `/admin/dashboard`

---

## Overview

The Super Admin Dashboard is the supreme technical and operational command center for Welile Technologies Limited. It provides absolute oversight over system configuration, global security auditing, role-based access control (RBAC), and technical infrastructure health. Unlike executive dashboards (CEO/CFO), this interface is optimized for direct system manipulation and security enforcement.

---

## Access & Navigation

| Method | Path |
|--------|------|
| Direct URL | `/admin/dashboard` |
| Deep Link | `/admin/settings`, `/admin/users` |

**Allowed Roles:** `super_admin` only.

---

## Sidebar Sections

The Super Admin dashboard uses a unified sidebar layout with the following tabs:

### Administration Section
| Tab | Description |
|-----|-------------|
| **System Overview** | 8-KPI system health grid + infrastructure charts |
| **User Matrix** | Global user management, role assignment, and freezing |
| **Audit Logs** | Immutable global security and action tracking |
| **C-Suite Impersonation** | Fast-switch access to CEO, COO, CFO read-only views |
| **Global Config** | Core platform parameters (fees, limits, feature toggles) |

---

## System Overview (Default View)

### KPI Grid (8 Cards)

The overview displays 8 absolutely critical system health indicators in a responsive grid:

| KPI | Source | Description |
|-----|--------|-------------|
| **Total Platform Accounts** | `profiles` table (count) | Total raw profiles created in the database |
| **Active Sessions** | `sessions` table (where not revoked) | Current live JWT sessions across the platform |
| **Security Alerts** | `audit_logs` (severity high) | Unresolved or anomalous system behavior actions |
| **Pending KYC Verifications** | `userPersonas` / `profiles` | Users awaiting manual identity verification |
| **Frozen Accounts** | `profiles` (where is_frozen=true) | Accounts currently locked due to AML/security flags |
| **Total Global Wallets** | `wallets` table | Total number of cryptographic/fiat wallets generated |
| **System Uptime** | Server Telemetry | Infrastructure availability metric |
| **API Latency** | Infrastructure Traefik logs | Average response time across core endpoints |

**Data Freshness:** Super Admin widgets heavily prioritize **live telemetry** over cached snapshots. React Query `staleTime` is drastically reduced (`15000ms`) to provide real-time situational awareness.

---

## Core Operational Modules

### User Matrix (Role Management)
The User Matrix is a high-powered data grid allowing the Super Admin to:
- Instantly search any user by email, phone, or UUID.
- Modify the raw `role` string on the `profiles` table.
- Inject, update, or revoke entries in the `userPersonas` table.
- Trigger an emergency `is_frozen = true` action globally terminating a user's active sessions.

### Global Audit Logs
An immutable ledger tracking every significant state change across the platform:
- `user_id` tracking of who executed the action.
- `ip_address` and `user_agent` logging.
- Action tags (e.g., `ROLE_UPDATE`, `WALLET_FREEZE`, `LOGIN_FAILED`).

### C-Suite Impersonation
Super Admins require the ability to rapidly view the system exactly as their executives see it to verify data integrity. The Impersonation panel provides direct links to `/ceo/dashboard`, `/coo/overview`, and `/cfo/dashboard`.

---

## Data Architecture

### Caching Strategy

| Layer | TTL | Purpose |
|-------|-----|---------|
| React Query `staleTime` | 15 seconds | Near real-time data for critical system widgets |
| Live Sockets (Optional)| 0 seconds | Real-time pushing of critical security alerts |
| `audit_logs` | Real-time | Directly queried with pagination to prevent heap overflow |

### Data Sources

| Table / Source | Used For |
|-------|----------|
| `profiles` & `userPersonas` | User Matrix, Role assignment, Account freezing |
| `sessions` | Active token termination, device logging |
| `audit_logs` | Activity tracking, global security monitor |
| Server Environment | API health, uptime metrics |

---

## Design Principles

1. **Information Density** — The design favors high-density data tables over padded visual charts. Super Admins need to read raw data quickly.
2. **Absolute Functionality** — Includes destructive actions (e.g., Freeze Account, Revoke Roles) protected by standard confirmation modals.
3. **Auditability First** — Every action taken within the Super Admin dashboard silently writes a high-severity `audit_logs` entry.
4. **Separation of Concerns** — The Super Admin dashboard does NOT display financial revenue or marketing growth. It strictly monitors the platform's technical and operational engine.
5. **No Visual Fluff** — Sleek, dark-mode optimized, high-contrast UI mirroring an advanced terminal or developer tool.

---

## Related Documents

- [CEO Dashboard Workflow](./CEO_DASHBOARD_WORKFLOW.md) — Executive perspective
- [Permissions Configuration](../src/config/permissions.ts) — Source of truth for RBAC capabilities
- [System Structure](./SYSTEM_STRUCTURE.md) — Technical architecture overview
