import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';
export declare class WalletsService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyWallet(userId: string): Promise<{
        credits: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            type: TransactionType;
            description: string | null;
            referenceId: string | null;
            creditWalletId: string;
            debitWalletId: string;
            createdAt: Date;
        }, unknown> & {})[];
        debits: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            type: TransactionType;
            description: string | null;
            referenceId: string | null;
            creditWalletId: string;
            debitWalletId: string;
            createdAt: Date;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        userId: string;
        balance: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    processTransaction(data: {
        userId: string;
        amount: number;
        type: TransactionType;
        reference: string;
        description: string;
    }): Promise<{
        wallet: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            userId: string;
            balance: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
        transaction: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            type: TransactionType;
            description: string | null;
            referenceId: string | null;
            creditWalletId: string;
            debitWalletId: string;
            createdAt: Date;
        }, unknown> & {};
    }>;
}
