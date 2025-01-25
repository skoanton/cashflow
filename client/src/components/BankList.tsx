import { connectBank, getBanks } from "@/api/goCardLess"
import { Bank } from "@/types/general"
import { useEffect, useState } from "react"
import { ScrollArea } from "./ui/scroll-area"
import { Button } from "./ui/button"
import { Input } from "@/components/ui/input"
import { Divide } from "lucide-react"
import { useNavigate } from "react-router"

type BankListProps = {}

export default function BankList({ }: BankListProps) {

    const [banks, setBanks] = useState<Bank[] | null>(null)
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
    const [search, setSearch] = useState<string>('');
    const [filteredBanks, setFilteredBanks] = useState<Bank[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {

        async function fetchBanks() {
            try {
                const response = await getBanks();

                if (!response) {
                    return null;
                }

                console.log('response:', response.data);
                setBanks(response.data);
            } catch (error) {
                console.error('Error during handleConnectBank:', error);
            }
        }
        fetchBanks()
    }, [])

    async function handleConnectBank() {
        setLoading(true);
        if (!selectedBank) {
            setShowError(true);
            setLoading(false);
            return;

        }

        const response = await connectBank(selectedBank.id);
        if (!response) {
            setLoading(false);
            return;
        }
        console.log('response:', response);
        setShowError(false);
        setLoading(false);
        window.location.href = response.link;
    }

    useEffect(() => {
        if (!banks) {
            return;
        }

        if (!search) {
            setFilteredBanks(banks);
            return;
        }

        const filtered = banks.filter((bank) => bank.name.toLowerCase().includes(search.toLowerCase()));
        setFilteredBanks(filtered);
    }, [search, banks])

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.currentTarget.value);
    }

    function handleSelectBank(bank: Bank) {
        if (selectedBank?.id === bank.id) {
            setSelectedBank(null);
            return;
        }
        setSelectedBank(bank);
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <Input type="text" onChange={(e) => handleSearch(e)} placeholder="Serach bank" />
            <ScrollArea className="w-96 h-96 bg-gray-200 rounded-md p-5">
                {filteredBanks?.map((bank) => {
                    return (
                        <div onClick={() => handleSelectBank(bank)} key={bank.id} className="flex items-center space-x-4 p-4 border-b border-gray-200 hover:cursor-pointer hover:bg-gray-300 ">
                            {selectedBank?.id === bank.id &&
                                <div className="justify-self-end">
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAR1JREFUWEftl80NgkAQhd9AI7Rg1GSPeDDShdKJnYhdaDzgkUSNJYiFuKNLolFc+cmuigauMPM+HvOzEL580Zf10QI014FgLzwpMSaGZ1onxJgv+slal0frwHAnJsSYmQrfxzuMgQ5CCzDaihkDE5sABETLXhLmc7YAf+oAYQrOaujWQR+rASaEq24SDbciJsC/Ft1HAF6JK4i3AxSJGwMwsHZdhPKEg242lIkbAwBIHRcDlSgPUUXcBoDK8QRRVdwWwAPEScLXVfur8W2zCDMnFp0kzbda0e6wCZA5cVlW6X2fly0u2wBlek/3W4DfciDYCF8S4tofuiCg1pFM5VEQTBibQjBlHXNUM6PyodRUtE58c/8L6ryFybOtA2cXitAh1aIndAAAAABJRU5ErkJggg==" alt="selected" height={24} width={24} />
                                </div>}
                            <img src={bank.logo} alt={bank.name} height={48} width={48} />
                            <p>{bank.name}</p>
                        </div>
                    )
                })}
            </ScrollArea>
            {showError && <p className="text-red-500">Please select a bank</p>}
            <Button disabled={loading} onClick={() => handleConnectBank()}> {!loading ? "Connect" : <div className="animate-spin p-2">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAglJREFUWEfFl+1xwjAMht9cCXeaojBJYRLKJIVJoJNAJyGdwnd8XBr5I9hOcGJDUv+BSxzrsfRKsjP888hS7YuLWKDESn6foUCJX/6lnI4xa6YDnMUnMuwaxkoUAI64YUtE/D84Xg9gzDFIhj3ltA0RJAOYRYUQM/l/gpkOyaIyrJ7xYJAblo+88TSAvzsJNMGqMswhUiDKG+s2fbwcwPEMgwCbkCcGA2CjtTcsCJrS3PbaoAAWBGfLQntiT1NaG4jBAWqINxykJjxRjgIgIey6UaL2wngAKjtUKEoURgujAUgvXMRXnRXAktNybAAW4kGLcU1T2ksA3Vhk0eCHHeU7+bVOy5NeYMNlWgGcxa7qZJ8SIKfBvOIAaCGOCqC9Xdr1wITgLo4r5n3aaEocQiGwe7tUZ4qBrm+8WmCJUOWoEodVJLoWjH1vaw3a07XgxEVwejhFItZA13xxFifToo3YbYC7DkpI93QtGPO+sxR7KVKXyhgjobn27o37eb6T816pPFJOy1cA1OFt0ZgLwGI0bVNZltXqGQhHeFYTMms2qp6Xqzwv2RPOzpXFRoq3lt0GRM8jttmVF8q0Q6mEcMOhFuJLR4ZvXFFwxXSO5cAHh80JWeBE3BChH+vGoTJeDJ0a6tX5Ws/6j2Aiw9ULwLalQ8O3n/eqbKuLB19O1fiJ7SPRAPFRCH/xB1V4EjDh+ejpAAAAAElFTkSuQmCC" alt="" />
            </div>}</Button>

        </div>
    )
}