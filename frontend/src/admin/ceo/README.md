# Sovereign CEO Terminal (Admin Dashboard)

## Overview

The CEO Terminal is a high-level executive dashboard module designed for the "Sovereign Intelligence" platform. It provides top-tier management with a comprehensive view of global operations, financial health, staff performance, and real-time alerts.

The module is located in `frontend/src/admin/ceo` and consists of two primary views:
1. **Global Overview** (`CeoDashboard.tsx`)
2. **Staff Performance** (`CeoPerformance.tsx`)

## Architecture & Styling

- **Design System**: Built utilizing a custom, highly opinionated color palette defined internally via a `<style>` block (`ceoColors`). It uses CSS variables and classes (like `.bg-surface`, `.text-on-surface`, `.bg-primary-fixed`) combined with Tailwind utility classes for layout, typography, and spacing.
- **Glassmorphism & Nav**: Features a fixed glassmorphic top navigation bar (`backdrop-blur-xl`) and a persistent sidebar for routing.
- **Typography & Icons**: Uses `font-headline` and `font-body` for distinct typographic hierarchy, alongside Google Material Symbols (`material-symbols-outlined`) for iconography.

---

## 1. Global Overview (`CeoDashboard.tsx`)

The main entry point for the CEO, focusing on high-level KPIs, growth metrics, and aggregate financial data.

### Key Features:
- **KPI Grid (Top Metrics)**: Shows critical platform numbers including Total Users, Tenants Funded, Rent Financed, Total Landlords, Capital Partners, Platform Revenue, Rent Repaid (Collection Efficiency), and Active Agents. Indicators highlight positive/negative growth compared to the previous period.
- **Growth Metrics Panel**: A detailed column displaying Active Users, New Users, Retention Rate, Referral Multipliers, and Daily Transactions with custom mini sparkline charts and progress bars.
- **Financial & Growth Charts**:
  - **Tenant Growth**: A stylized bar chart showing month-over-month growth.
  - **Capital Raised**: An area chart visualizing capital inflows.
  - **Rent Repayment**: Progress bars comparing actual collection efficiency against target SLAs.
- **Recent Rent Requests Table**: A structured data table showing recent tenant funding requests, complete with tenant avatars, status pills (Pending, Funded, Declined, Overdue), and financial breakdowns (Amount, Repaid, Balance).

---

## 2. Staff Performance (`CeoPerformance.tsx`)

A dedicated operational oversight view focused on internal team efficiency, SLA targets, and system security.

### Key Features:
- **Executive Performance Leaderboard**: Ranks staff members based on task completion, accuracy percentage, average response time, and automation approval rates.
- **SLA Compliance Tracker**: Progress visualizers for Response SLA and Accuracy SLA, explicitly comparing real-time actuals against target benchmarks.
- **Monitoring & Alerts**:
  - **Critical Idle Alerts**: Highlights staff who are idle beyond acceptable thresholds or impending SLA violations, with quick action buttons (Ping, Reassign).
  - **Real-time Audit Stream**: A continuous vertical timeline of system events, including compliance overrides, bulk batch approvals, standard session initiations, security alerts (e.g., geographic mismatch/failed attempts), and data exports.
- **System Footnote**: Displays real-time operational metrics like System Latency and Load Balancing status.

## Navigation & Routing

The sidebar provides navigation hooks to multiple sections (though some may be placeholders for future development):
- Overview
- Revenue
- Users
- Financials
- Performance (Active in `CeoPerformance.tsx`)
- Settings & Support

## Future Considerations
- Migrate inline `<style>` configuration (`ceoColors`) into the global Tailwind configuration or CSS stylesheets for modularity.
- Connect static/mock data points (users, revenue, audit logs) to real-time backend API endpoints.
- Implement actionable features for the "Quick Action" and "Adjust Thresholds" buttons.
