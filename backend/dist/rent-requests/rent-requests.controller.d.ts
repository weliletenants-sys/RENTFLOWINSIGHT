import { RentRequestsService } from './rent-requests.service';
import { Role } from '@prisma/client';
export declare class RentRequestsController {
    private readonly rentRequestsService;
    constructor(rentRequestsService: RentRequestsService);
    createRequest(req: any, body: {
        propertyId: string;
        amount: number;
        months: number;
    }): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        tenantId: string;
        propertyId: string;
        amountRequired: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").RequestStatus;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    getMyRequests(req: any): Promise<({
        property: {
            landlord: import("@prisma/client/runtime/library").GetResult<{
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                firstName: string;
                lastName: string;
                role: Role;
                verification: string;
                createdAt: Date;
                updatedAt: Date;
                agentId: string | null;
            }, unknown> & {};
        } & import("@prisma/client/runtime/library").GetResult<{
            id: string;
            address: string;
            city: string;
            country: string;
            landlordId: string;
            tenantId: string | null;
            rentAmount: import("@prisma/client/runtime/library").Decimal;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        tenantId: string;
        propertyId: string;
        amountRequired: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").RequestStatus;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    getAllRequests(): Promise<({
        tenant: {
            firstName: string;
            lastName: string;
            email: string;
        };
        property: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            address: string;
            city: string;
            country: string;
            landlordId: string;
            tenantId: string | null;
            rentAmount: import("@prisma/client/runtime/library").Decimal;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        tenantId: string;
        propertyId: string;
        amountRequired: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").RequestStatus;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    updateStatus(id: string, body: {
        status: 'APPROVED' | 'REJECTED' | 'FUNDED';
    }): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        tenantId: string;
        propertyId: string;
        amountRequired: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").RequestStatus;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
}
