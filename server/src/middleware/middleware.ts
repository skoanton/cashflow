import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';


export async function authenticate(req:Request, res:Response, next: NextFunction):Promise<any> {

    const authHeader = req.headers['authorization'];

    if(process.env.JWT_SECRET === undefined) {
        return res.status(500).json('Not defined JWT_SECRET in environment variables');
    }

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json('Missing authorization token');
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json('Invalid or expired token');
        }
        req.user = user;
        next();
    });
}