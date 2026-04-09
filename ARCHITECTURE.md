# System Architecture

This document outlines the high-level infrastructure of the platform. We follow a strict **Three-Tier Architecture** to ensure separation of concerns, massive scalability, and robust security.

## Three-Tier Architecture Line Diagram (Our Stack)

```text
┌───────────────────────────────┐
│        FRONTEND LAYER         │
│                               │
│   React (PWA / Web / Mobile)  │
│                               │
│ - User Interface              │
│ - Dashboards                  │
│ - Forms (Withdraw, Deposit)   │
└───────────────┬───────────────┘
                │  HTTPS (API Calls)
                ↓
┌───────────────────────────────┐
│        API LAYER              │
│                               │
│   Node.js (Express / NestJS)  │
│                               │
│ - Authentication (JWT)        │
│ - Business Logic              │
│ - Role Control (CFO/Ops/Agent)│
│ - Validation & Security       │
└───────────────┬───────────────┘
                │  SQL Queries
                ↓
┌───────────────────────────────┐
│        DATA LAYER             │
│                               │
│        AWS RDS (PostgreSQL)   │
│                               │
│ - Users                       │
│ - Transactions                │
│ - Wallet Balances             │
│ - Audit Logs                  │
└───────────────────────────────┘
```

## How Data Flows (Real Example)

**Scenario:** A user initiates a transaction (e.g., clicks "Withdraw")

```text
User clicks "Withdraw"
        ↓
React sends request → API
        ↓
Node.js checks:
   - Is user valid?
   - Is balance enough?
   - Is agent approved?
        ↓
API updates → AWS RDS
        ↓
Response sent back → React UI updates
```

## Why This Architecture Works

This isn’t just drawing boxes — it defines exactly where components live and how they talk to each other:

1. **Clear Separation of Concerns:** UI states remain decoupled from server processes.
2. **Controlled Data Flow:** Information and state transitions follow a strict, unidirectional path.
3. **Centralized Logic (The Brain):** The API layer is the only place where business logic actually lives, serving as the sole gatekeeper for data manipulation. 
4. **Infinite Scalability:** We can easily add completely new frontends (like a native iOS/Android application) without altering a single line of backend code.

## System Component Diagram

Below is the exhaustive architectural diagram detailing the various client portals, the Node.js API layer endpoints, and the PostgreSQL Persistence layer representing our system.

```mermaid
flowchart TB

    subgraph Client_Tier ["Computer Client Interfaces (React + TanStack Query)"]
        direction LR
        subgraph Consumers ["Consumer Portals"]
            direction TB
            Tenant(Tenant PWA Dashboard)
            Landlord(Landlord Immersive UI)
            Agent(Agent Gamified App)
            Funder(Supporter or Funder Hub)
        end
        
        subgraph Admin_Apps ["Admin Console Elements"]
            direction TB
            SuperAdmin(SuperAdmin Controller)
            COO(COO Logistics Hub)
            CFO(CFO Financial Ledger)
            CRM(CRM Support Dashboard)
        end
    end

    subgraph App_Tier ["Application Core (Express.js API Brain)"]
        direction TB
        
        AuthMiddleware{"Auth & Role Guards"}
        
        subgraph Controllers ["REST Controllers (RFC 7807)"]
            direction LR
            CtrlTenant["Tenant Controller"]
            CtrlAgent["Agent Controller"]
            CtrlLandlord["Owner Controller"]
            CtrlFunder["Funder Controller"]
            CtrlSystem["System Admin Controllers"]
        end
        
        subgraph Services ["Business Services Layer"]
            direction LR
            WalletSvc["Unified Wallet Service"]
            RentSvc["Rent Management Service"]
            WelileSvc["Welile Homes Manager"]
            NotifSvc["Event/Notification Service"]
        end
    end

    subgraph Data_Tier ["Persistence Layer"]
        direction LR
        Prisma{"Prisma ORM"}

        subgraph Tables ["PostgreSQL Models"]
            direction TB
            T_Profiles[(Profiles)]
            T_Landlords[(Landlords or Properties)]
            T_Ledger[(LedgerTransactions)]
            T_Rent[(RentRequests)]
        end
    end

    subgraph External_Integrations ["3rd Party Integrations"]
        direction LR
        MobileMoney{{"Mobile Money (MTN/Airtel/MoMo)"}}
        SMS{{"SMS Comms Engine (Twilio/AT)"}}
        Supabase{{"Identity Auth (Supabase)"}}
    end

    Tenant -.->|"Axios Bearer"| AuthMiddleware
    Landlord -.->|"Axios Bearer"| AuthMiddleware
    Agent -.->|"Axios Bearer"| AuthMiddleware
    Funder -.->|"Axios Bearer"| AuthMiddleware
    Admin_Apps -.->|"Axios Bearer"| AuthMiddleware

    %% Centralized Consumer Route via Unified Wallet
    AuthMiddleware -->|"Decodes JWT"| WalletSvc
    WalletSvc ==>|"Evaluates Balances & Persona Modes"| CtrlTenant
    WalletSvc ==>|"Distributes Role"| CtrlLandlord
    WalletSvc ==>|"Distributes Role"| CtrlAgent
    WalletSvc ==>|"Distributes Role"| CtrlFunder

    %% Admin Bypass Routing
    AuthMiddleware -->|"Decodes Admin Identity"| CtrlSystem

    CtrlTenant ==> RentSvc
    CtrlLandlord ==> RentSvc
    CtrlLandlord ==> WelileSvc
    CtrlSystem ==> NotifSvc

    Services ==> Prisma
    Prisma ==> Tables

    WalletSvc -.->|"Payouts/Collections"| MobileMoney
    NotifSvc -.->|"OTP & Invites"| SMS
    AuthMiddleware <.->|"Validate Bearer"| Supabase

```
