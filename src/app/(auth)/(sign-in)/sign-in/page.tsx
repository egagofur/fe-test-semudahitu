'use client'

import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formSchema, TFormSchema } from "../_schema/schema";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

const SignUpPage = () => {
    const router = useRouter();

    const handleSubmit = async (values: TFormSchema) => {
        const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
        });

        if (result?.error) {
            console.log(result.error);
        } else {
            toast({
                title: "Berhasil",
                description: "Anda berhasil masuk",
                variant: "default",
            });
            redirect( "/");
        }
    };

    return (
        <div className="bg-gradient-to-r from-[#CDDFF7] to-[#7FB6FF] overflow-hidden flex w-full h-screen items-center p-16">
            <Card className="py-10 px-16 w-fit bg-white shadow-card-shadow">
                <CardHeader>
                    <CardTitle className="text-4xl font-semibold leading-[48px]">
                        Selamat Datang
                        <span className="block">Kembali 👋</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AutoForm onSubmit={handleSubmit} formSchema={formSchema} className="w-[408px]">
                        <AutoFormSubmit className="w-full">Masuk</AutoFormSubmit>
                        <Separator className="my-6" />
                        <Button variant="outline" className="w-full space-x-2 text-primary">
                            <span className="font-bold">G</span>
                            <span className="font-semibold">Continue with Google</span>
                        </Button>
                    </AutoForm>
                </CardContent>
                <CardFooter className="w-full flex justify-center">
                    <CardDescription>
                       Belum punya akun? <Link href='/sign-up' className="text-primary font-semibold">Daftar Disini</Link>
                    </CardDescription>
                </CardFooter>
            </Card>
            <div className="flex-1 right-10 h-screen scale-150 hidden md:block">
                <Image
                    className="w-full h-full"
                    src="/images/auth-bg.svg"
                    alt="image description"
                    width={630}
                    height={891}
                    priority
                />
            </div>
        </div>
    );
};

export default SignUpPage;
