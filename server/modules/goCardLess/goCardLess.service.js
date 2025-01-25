import axios from "axios";
import dotenv from "dotenv";
import { jwtDecode } from "jwt-decode";
import bcrypt from "bcrypt";
import { getBankConnections, createBankConnection, createPendingAccount } from "./goCardLess.respiratory.js";
dotenv.config();

const BASE_URL = process.env.GOCARDLESS_BASE_URL;
let access_token = null;
let refresh_token = null;
let access_expires_in = null;
let refresh_expires_in = null;


export async function getToken() {

    if (isTokenValid()) {
        return access_token;
    }
    else {
        console.log("Token expired, refreshing...");
    }

    const data = refresh_token && refresh_expires_in > Date.now() ? {
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

    } catch (error) {
        console.error("Failed to get access token:", error.response?.data || error.message);
        throw new Error("Unable to retrieve access token");
    }
}


function isTokenValid() {
    return access_token && access_expires_in > Date.now();
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
    } catch (error) {
        console.error("Failed to get banks:", error.response?.data || error.message);
        throw new Error("Unable to retrieve banks");
    }
}

export async function connectBank(bankId, redirect) {
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
    } catch (error) {
        console.error("Failed to connect bank:", error.response?.data || error.message);
        throw new Error("Unable to connect bank");
    }
}


export async function getAccountsList(requisitionsId, userId) {
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
    } catch (error) {
        console.error("Failed to get accounts:", error.response?.data || error.message);
        throw new Error("Unable to retrieve accounts");
    }
}

export async function getConnectedBankData(userId) {

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
                        id: bankConnection.institutionId,
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
    } catch (error) {
        console.error("Failed to get connections:", error.response?.data || error.message);
        throw new Error("Unable to retrieve connections");
    }
}