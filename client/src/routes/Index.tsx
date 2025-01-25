import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router";
type IndexPageProps = {}

export default function IndexPage({ }: IndexPageProps) {

    let navigate = useNavigate();



    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen gap-5">
                <h1 className="text-5xl font-bold">Cash Flow</h1>
                <div className="flex flex-col gap-4">
                    <Button onClick={() => navigate("/login")} >Login</Button>
                    <Button>Register</Button>
                </div>
            </div >
        </>
    )
}