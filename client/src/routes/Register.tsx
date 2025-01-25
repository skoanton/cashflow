import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
})
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { register } from "@/api/auth"
import { Link, useNavigate } from "react-router"

type RegisterPageProps = {}


export default function RegisterPage({ }: RegisterPageProps) {

    let navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {

        const result = await register(values.email, values.password);

        if (result.error) {
            form.setError("email", {
                type: "manual",
                message: result.error,
            });
        }
        else {
            navigate("/login");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-5">
            <h1 className="text-4xl font-bold">Register</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="w-full" type="submit">Sign up</Button>
                </form>
            </Form>
            <Link to="/login">Login</Link>
        </div>
    )
}