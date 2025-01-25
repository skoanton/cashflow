import { Request,Response } from 'express';
import { getBanks, connectBank, getAccountsList, getConnectedBankData } from './goCardLess.service';

export async function getBanksHandler(req:Request, res:Response) {

    try {
        const response = await getBanks();
        res.json(response);
    } catch (error:any) {

        res.status(500).send(error.message);
    }
}


export async function connectHandler(req:Request, res:Response) : Promise<any> {

    const { bankId, redirect } = req.body;

    if (!bankId || !redirect) {
        return res.status(400).send({message:'Bank ID and redirect URL are required'});
    }

    try {
        const response = await connectBank(bankId, redirect);
        res.json(response);
    } catch (error:any) {
        res.status(500).send(error.message);
        
    }
}

export async function getAccountListHandler(req: any, res:Response): Promise<any> {
    const { id } = req.params;
    const userId = req.user.userId;
    if (!id) {
        return res.status(400).send('Requisitions ID is required');
    }

    try {
        const response = await getAccountsList(id, userId);
        res.json(response);
    } catch (error:any) {
        res.status(500).send(error.message);
    }
}

export async function getConnectionsHandler(req: any, res:Response):Promise<any> {
    const userId = req.user.userId;

    try {
        const response = await getConnectedBankData(userId);
        res.json(response);
    } catch (error:any) {
        res.status(500).send(error.message);
    }
}