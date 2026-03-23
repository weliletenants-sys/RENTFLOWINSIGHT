# COO Dashboard Integration Guide: Funder Opportunities

This document outlines the database architecture implemented for the Funder Marketplace and provides exactly what the COO Dashboard developer needs to know to populate the housing supply accurately.

## 1. Architectural Context

The Funder Marketplace (Opportunities Page) no longer uses mocked JSON data. It now organically queries the SQL database.

To protect real Tenant PII from public Funders, the system uses an abstraction layer called **Virtual Opportunities**. The Funder dashboard simply executes a `findMany` on this table. Therefore, to make properties appear in the Funder marketplace, the COO Dashboard must write data to this specific table.

## 2. The Database Schema

The database table was generated via Prisma. Here is the exact Prisma model it expects:

```prisma
model VirtualOpportunities {
  id            String   @id @default(uuid())
  name          String   // e.g. "Kampala Heights Apt 4B"
  location      String   // e.g. "Makindye, Kampala"
  image_url     String?  // e.g. "https://s3.../property_1.png"
  rent_required Float    // Requisite funding amount in UGX (e.g. 850000)
  bedrooms      Int      // e.g. 2
  status        String   @default("available") // Must be: "available" | "urgent" | "taken"
  created_at    String
  updated_at    String

  @@map("virtual_opportunities")
}
```

## 3. Implementation Instructions for the COO Backend

When building the `POST /api/coo/opportunities` endpoint, the COO developer should ensure the request payload populates all required fields and executes the following Prisma transaction:

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOpportunity = async (req: Request, res: Response) => {
  try {
    const { name, location, image_url, rent_required, bedrooms, status } = req.body;
    
    // Strict validation requirement
    if (!name || !location || !rent_required || !bedrooms) {
        return res.status(400).json({ error: "Missing required fields for Funder marketplace" });
    }

    const now = new Date().toISOString();

    const newOpportunity = await prisma.virtualOpportunities.create({
      data: {
        name,
        location,
        image_url, // Optional: if omitted, frontend defaults to '/property_1.png'
        rent_required: Number(rent_required),
        bedrooms: Number(bedrooms),
        status: status || 'available', // Enforce 'available', 'urgent', or 'taken'
        created_at: now,
        updated_at: now
      }
    });

    return res.status(201).json({ status: 'success', data: newOpportunity });
  } catch (error) {
    console.error('Failed to create virtual opportunity', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
```

## 4. Frontend Status Enums

The Funder Dashboard frontend strictly accepts only 3 string enums for the `status` column:
- `"available"`: Shows a Green badge
- `"urgent"`: Shows a Red badge
- `"taken"`: Shows a Grayed-out block (not clickable by Funders)

The COO frontend dropdowns should restrict standard status inputs to exactly these values.
