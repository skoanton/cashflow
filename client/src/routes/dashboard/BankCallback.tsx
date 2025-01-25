import { listAccounts } from "@/api/goCardLess";
import { useEffect } from "react"
import { useNavigate } from "react-router";

type BankCallbackProps = {}

export default function BankCallback({ }: BankCallbackProps) {
    const navigate = useNavigate();
    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const requisitionId = urlParams.get('ref');
            console.log('requisitionId:', requisitionId);

            if (!requisitionId) {
                console.error('BankId is missing');
                return;
            }

            try {
                const accounts = await listAccounts(requisitionId); // Nästa steg: Lista konton
                console.log('Fetched accounts:', accounts);

                navigate('/dashboard');

            } catch (error) {
                console.error('Error during handleCallback:', error);
            }
        }

        handleCallback();
    }, [])

    return <div>Laddar, vänligen vänta...</div>;
}