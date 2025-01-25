import BankList from "@/components/BankList"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";

type BankConnectionModalProps = {

}

export default function BankConnectionModal({ }: BankConnectionModalProps) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button>Connect Bank</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Bank Connection</DialogTitle>
                        <DialogDescription>
                            Connect your bank account to start tracking your expenses.
                        </DialogDescription>
                    </DialogHeader>
                    <BankList />
                </DialogContent>
            </Dialog>
        </>
    )
}