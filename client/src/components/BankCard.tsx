import { confirmBankAccounts } from "@/api/goCardLess"
import { Bank } from "@/types/general"

type BankCardProps = {
    bank: Bank
}

export default function BankCard({ bank }: BankCardProps) {

    const handleClick = async () => {
        console.log('Bank:', bank);
        const response = await confirmBankAccounts(bank.institution_id);
        if (!response) {
            return;
        }
        console.log('Bank:', response);
    }
    return (
        <>
            <div onClick={() => handleClick()} className="flex items-center gap-5 p-4 border-b border-gray-200 hover:cursor-pointer hover:bg-gray-300 ">
                <img src={bank.logo} alt={bank.name} height={32} width={32} />
                <p>{bank.name}</p>
            </div>
        </>
    )
}