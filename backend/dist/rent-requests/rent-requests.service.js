"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentRequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RentRequestsService = class RentRequestsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRequest(userId, data) {
        const property = await this.prisma.property.findUnique({
            where: { id: data.propertyId }
        });
        if (!property)
            throw new common_1.NotFoundException('Property not found');
        return this.prisma.rentRequest.create({
            data: {
                amountRequired: data.amount,
                status: 'PENDING',
                tenant: { connect: { id: userId } },
                property: { connect: { id: data.propertyId } }
            }
        });
    }
    async getMyRequests(userId) {
        return this.prisma.rentRequest.findMany({
            where: { tenantId: userId },
            include: {
                property: { include: { landlord: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getAllRequests() {
        return this.prisma.rentRequest.findMany({
            include: {
                tenant: { select: { firstName: true, lastName: true, email: true } },
                property: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateStatus(id, status) {
        return this.prisma.rentRequest.update({
            where: { id },
            data: { status }
        });
    }
};
exports.RentRequestsService = RentRequestsService;
exports.RentRequestsService = RentRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RentRequestsService);
//# sourceMappingURL=rent-requests.service.js.map