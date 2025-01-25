import { logout } from "@/api/auth";
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BankConnectionModal from "./BankConnectionModal";
import { getBankConnections } from "@/api/goCardLess";
import { Bank } from "@/types/general";
import BankCard from "@/components/BankCard";

type DashboardPageProps = {}

export default function DashboardPage({ }: DashboardPageProps) {
    const [bankConnections, setBankConnections] = useState<Bank[] | null>(null)


    useEffect(() => {

        async function fetchBankConnections() {
            console.log('fetchBankConnections')
            try {
                const response = await getBankConnections();

                if (!response) {
                    return null;
                }

                console.log('response:', response.data);
                setBankConnections(response.data);
            } catch (error) {
                console.error('Error during handleConnectBank:', error);
            }
        }
        fetchBankConnections();

    }, [])

    const navigate = useNavigate();


    const handleLogout = async () => {
        const response = await logout();
        if (response.error) {
            console.log("An error occurred")
            return;
        }
        navigate("/login");
    }


    return (
        <>
            <h1>Dashboard</h1>
            <BankConnectionModal />
            <Button onClick={() => handleLogout()}>Logout</Button>
            <h2>Bank Connections</h2>
            <ul>
                {bankConnections?.map((bank) => (
                    <BankCard key={bank.id} bank={bank} />
                ))}
            </ul>

        </>
    )
}