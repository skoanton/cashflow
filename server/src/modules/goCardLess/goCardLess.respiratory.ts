import { AccountType, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createBankConnection(userId:string, bankId:string, institution_id:string) {
    return await prisma.bankConnection.create({
        data: {
            userId: Number(userId),
            bankId: bankId,
            institutionId: institution_id,
        },
    });
}

export async function getBankConnections(userId:string) {
    return await prisma.bankConnection.findMany(
        {
            where: {
                userId: Number(userId),
            },
        }
    );
}

export async function createPendingAccount(accountId:string, bankConnectionId:number) {
    return await prisma.pendingAccount.create({
        data: {
            externalId: accountId,
            bankConnectionId: bankConnectionId,
        },
    });
}

export async function createAccount(userId:string, externalId:string,accountName:string) {
    return await prisma.account.create({
        data: {
            name: accountName,
            userId: parseInt(userId),
            externalId: externalId,
            type: AccountType.Credit,

        },
    });
}

export async function getPendingAccounts(bankConnectionId:number) {
    return await prisma.pendingAccount.findMany({
        where: {
            bankConnectionId: bankConnectionId,
        },
    });
}