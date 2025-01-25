import { Bank } from '@/types/general';
import axios from 'axios';


const BASE_URL = import.meta.env.VITE_BASE_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export async function getBanks(): Promise<Bank[] |null> {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/bank`, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        });
        let banks: Bank[] = [];
        for(const bank of response.data) {
            const newBank: Bank = {
                institution_id: bank.id,
                name: bank.name,
                logo: bank.logo,
                bic: bank.bic
                
            }
            banks.push(newBank);
            
        }

        return banks;
    } catch (error) {
        console.error('Error during handleConnectBank:', error);
        return null;    
    }
}

export async function connectBank(bankId: string) {
    console.log('Connecting to bank:', bankId);
    const redirect = `${FRONTEND_URL}/bank/callback`;
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${BASE_URL}/api/bank/connect`, { bankId,redirect }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('response:', response.data);
        
        return response.data;
    }
    catch (error) {
        console.error('Error during handleConnectBank:', error);
    }   
       
}

export async function listAccounts(requisitionId: string) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/bank/accounts/${requisitionId}/list`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error during listAccounts:', error);
    }
}

export async function getBankConnections() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/bank/connections`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response;
    } catch (error) {
        console.error('Error during getBankConnections:', error);
    }

}

export async function confirmBankAccounts(institution_id: string) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/bank/accounts/${institution_id}/confirm`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('response:', response.data);
        return response;
    } catch (error) {
        console.error('Error during getBankAccounts:', error);
    }
}