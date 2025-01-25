import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findUserByEmail = async (email:string) => {
    return await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
}

export const createUser = async (email:string, password:string) => {
    return await prisma.user.create({
        data: {
            email: email,
            password: password,
        },
    });
}