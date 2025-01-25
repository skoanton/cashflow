import axios from "axios";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { getBankConnections, createBankConnection, createPendingAccount, getPendingAccounts, createAccount } from "./goCardLess.respiratory";
import { Account } from "@prisma/client";
dotenv.config();

const BASE_URL = process.env.GOCARDLESS_BASE_URL;
let access_token:string | null = null;
let refresh_token:string | null = null;
let access_expires_in:number | null = null;
let refresh_expires_in:number | null = null;


export async function getToken() {

    if (isTokenValid()) {
        return access_token;
    }
    else {
        console.log("Token expired, refreshing...");
    }
    
    const data = refresh_token && refresh_expires_in !== null && refresh_expires_in > Date.now() ? {
        refresh: refresh_token,
    } : {
        secret_id: process.env.GOCARDLESS_SECRET_ID,
        secret_key: process.env.GOCARDLESS_SECRET_KEY,
    };
    try {
        const response = await axios.post(`${BASE_URL}/api/v2/token/new/`, data, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });
        access_token = response.data.access;
        refresh_token = response.data.refresh;
        access_expires_in = Date.now() + response.data.access_expires * 1000;
        refresh_expires_in = Date.now() + response.data.refresh_expires * 1000;
        return access_token;

    } catch (error:any) {
        console.error("Failed to get access token:", error.response?.data || error.message);
        throw new Error("Unable to retrieve access token");
    }
}


function isTokenValid() {
    return access_token && access_expires_in !== null && access_expires_in > Date.now();
}


export async function getBanks() {

    const token = await getToken();

    if (!token) {
        throw new Error("Unable to retrieve access token");
    }

    try {
        const response = await axios.get(`${BASE_URL}/api/v2/institutions/?country=se`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error:any) {
        console.error("Failed to get banks:", error.response?.data || error.message);
        throw new Error("Unable to retrieve banks");
    }
}

export async function connectBank(bankId:string, redirect:string) {
    const token = await getToken();

    if (!token) {
        throw new Error("Unable to retrieve access token");
    }

    try {
        const response = await axios.post(`${BASE_URL}/api/v2/requisitions/`, {
            institution_id: bankId,
            redirect: redirect,
            user_language: "SV",
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error:any) {
        console.error("Failed to connect bank:", error.response?.data || error.message);
        throw new Error("Unable to connect bank");
    }
}

export async function getAccountsList(requisitionsId:string, userId:string) {
    const token = await getToken();

    if (!token) {
        throw new Error("Unable to retrieve access token");
    }

    try {
        const response = await axios.get(`${BASE_URL}/api/v2/requisitions/${requisitionsId}/`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const existingConnections = await getBankConnections(userId);
        const matchingBankConnection = existingConnections.find((connection) => connection.institutionId === response.data.institution_id)?.bankId;
        if (!matchingBankConnection) {

            const accountsIds = response.data.accounts;

            const bankId = response.data.id;
            const institution_id = response.data.institution_id
            console.log("Bank ID:", bankId);
            console.log("Institution ID:", institution_id);
            console.log("User ID:", userId);
            const hashedBankId = await bcrypt.hash(bankId, 10);
            if (hashedBankId && userId && institution_id) {
                const bankConnection = await createBankConnection(userId, hashedBankId, institution_id);
                if (bankConnection) {
                    console.log("Bank connection created successfully");
                    for (const accountId of accountsIds) {
                        const pendingAccount = await createPendingAccount(accountId, bankConnection.id);
                        if (pendingAccount) {
                            console.log("Pending account created successfully");
                        }
                        else {
                            console.error("Failed to create pending account");
                        }
                    }
                }
                else {
                    console.error("Failed to create bank connection");
                }
            }
        }
        return response.data;
    } catch (error: any) {
        console.error("Failed to get accounts:", error.response?.data || error.message);
        throw new Error("Unable to retrieve accounts");
    }
}

export async function getConnectedBankData(userId:string) {

    const token = await getToken();

    if (!token) {
        throw new Error("Unable to retrieve access token");
    }

    try {
        const bankConnections = await getBankConnections(userId);

        const banks = await Promise.all(
            bankConnections.map(async (bankConnection) => {
                try {
                    const response = await axios.get(
                        `${BASE_URL}/api/v2/institutions/${bankConnection.institutionId}/`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": `Bearer ${token}`,
                            },
                        }
                    );

                    return {
                        institution_id: bankConnection.institutionId,
                        bic: response.data.bic,
                        name: response.data.name,
                        logo: response.data.logo,
                    };
                } catch (error) {
                    console.error(`Failed to fetch bank data for institution_id: ${bankConnection.institutionId}`);
                    return null;
                }
            })
        );

        return banks.filter(Boolean);
    } catch (error:any) {
        console.error("Failed to get connections:", error.response?.data || error.message);
        throw new Error("Unable to retrieve connections");
    }
}
export async function confirmAccountService(institutionId:string, userId:string) {
    const token = await getToken();
    const accounts: Account[] = [];
    if (!token) {
        throw new Error("Unable to retrieve access token");
    }

    try {
        const bankConnections = await getBankConnections(userId);

        const currentBankConnection = bankConnections.find((connection) => connection.institutionId === institutionId);
        if (!currentBankConnection) {
            throw new Error("Bank connection not found");
        }
        const pendingAccounts = await getPendingAccounts(currentBankConnection.id);

        if(pendingAccounts.length === 0) {
            throw new Error("No pending accounts found");
        }

        for(const account of pendingAccounts) {
            try {
                const accountDetails = await axios.get(`${BASE_URL}/api/v2/accounts/${account.externalId}/details/`,  {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if(accountDetails){
                    console.log(`Accounts details,`,accountDetails);
                    const accountName = accountDetails.data.product;
                    const newAccount = await createAccount(userId, account.externalId, accountName);
                    if(newAccount){
                        console.log(`Account ${accountName} created successfully`);
                    }
                    else {
                        console.error(`Failed to create account: ${accountName}`);
                    }
                    accounts.push(newAccount);
                }
            } catch (error) {
                console.error(`Failed to fetch account details for account: ${account.externalId}`);
                console.error(error);
                continue;
            }
            
        }

    } catch (error:any) {
        console.error("Failed to confirm account:", error.response?.data || error.message);
        throw new Error("Unable to confirm account");
    }

    return accounts;
}