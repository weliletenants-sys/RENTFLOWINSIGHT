# RentFlow Insight System Architecture

This architectural blueprint outlines the entire Three-Tier structured ecosystem of the RentFlow Insight platform, capturing the interaction between client portals, the business logic layer, and the foundational database/system integrations.

![Rentflow System Diagram](file:///C:/Users/USER/.gemini/antigravity/brain/11bc20ac-0cc1-42cb-a9cc-50b43200db33/rentflow_system_architecture_1775572582037.png)

## Interactive Flowchart

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
