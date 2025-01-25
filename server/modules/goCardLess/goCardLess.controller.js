import { getBanks, connectBank, getAccountsList, getConnectedBankData } from './goCardLess.service.js';
export async function getBanksHandler(req, res) {

    try {
        const response = await getBanks();
        res.json(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


export async function connectHandler(req, res) {

    const { bankId, redirect } = req.body;

    if (!bankId || !redirect) {
        return res.status(400).send('Bank ID and redirect URL are required');
    }

    try {
        const response = await connectBank(bankId, redirect);
        res.json(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getAccountListHandler(req, res) {
    const { id } = req.params;
    const userId = req.user.userId;
    if (!id) {
        return res.status(400).send('Requisitions ID is required');
    }

    try {
        const response = await getAccountsList(id, userId);
        res.json(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getConnectionsHandler(req, res) {
    const userId = req.user.userId;

    try {
        const response = await getConnectedBankData(userId);
        res.json(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
}