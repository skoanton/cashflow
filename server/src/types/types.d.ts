import * as express from "express";

declare global {
    namespace Express {
        interface Request {
            user?: any; // Du kan specificera en mer detaljerad typ här
        }
    }
}