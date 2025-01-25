import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createBankConnection(userId, bankId, institution_id) {

    return await prisma.bankConnection.create({
        data: {
            userId: userId,
            bankId: bankId,
            institutionId: institution_id,
        },
    });
}

export async function getBankConnections(userId) {
    return await prisma.bankConnection.findMany(
        {
            where: {
                userId: userId,
            },
        }
    );
}

export async function createPendingAccount(accountId, bankConnectionId) {
    return await prisma.pendingAccount.create({
        data: {
            accountId: accountId,
            bankConnectionId: bankConnectionId,
        },
    });
}