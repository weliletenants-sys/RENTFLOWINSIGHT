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
exports.WalletsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WalletsService = class WalletsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyWallet(userId) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId },
            include: {
                credits: { orderBy: { createdAt: 'desc' }, take: 20 },
                debits: { orderBy: { createdAt: 'desc' }, take: 20 }
            }
        });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        return wallet;
    }
    async processTransaction(data) {
        return this.prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.findUnique({ where: { userId: data.userId } });
            if (!wallet)
                throw new common_1.NotFoundException('Wallet not found');
            if (data.amount < 0 && Number(wallet.balance) < Math.abs(data.amount)) {
                throw new common_1.BadRequestException('Insufficient wallet balance');
            }
            const updatedWallet = await tx.wallet.update({
                where: { id: wallet.id },
                data: { balance: { increment: data.amount } }
            });
            const transaction = await tx.transaction.create({
                data: {
                    amount: data.amount,
                    type: data.type,
                    referenceId: data.reference,
                    description: data.description,
                    creditWallet: { connect: { id: wallet.id } },
                    debitWallet: { connect: { id: wallet.id } },
                }
            });
            return { wallet: updatedWallet, transaction };
        });
    }
};
exports.WalletsService = WalletsService;
exports.WalletsService = WalletsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalletsService);
//# sourceMappingURL=wallets.service.js.map