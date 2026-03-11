import { WalletsService } from './wallets.service';
export declare class WalletsController {
    private readonly walletsService;
    constructor(walletsService: WalletsService);
    getMyWallet(req: any): Promise<{
        credits: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            type: import(".prisma/client").TransactionType;
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
            type: import(".prisma/client").TransactionType;
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
}
