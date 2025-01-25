import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from './auth.respiratory';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';

export async function login(email:string, password:string) {

    const existingUser = await findUserByEmail(email);

    if(!existingUser) {
        throw new Error('Invalid email or password');
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (isPasswordCorrect) {
        const token = generateToken(existingUser);
        return token;
    }
    else {
        throw new Error('Invalid email or password');
    }
}

export async function register(email:string, password:string) {
    const user = await findUserByEmail(email);

    if (user) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, hashedPassword);
    return newUser;

}

function generateToken(existingUser:User) {

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const expires_in = "1h"; // eller "60m"
    return jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET, { expiresIn: expires_in });
}