'use client';

import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { formSchema, TFormSchema } from "../_schema/schema";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRegisterUser } from "../_actions";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
    const registerMutation = useRegisterUser();
    const router = useRouter();

    const handleSubmit = async (values: TFormSchema) => {
        await registerMutation.mutateAsync(values, {
            onSuccess: () => {
                  toast({
                    title: 'Berhasil',
                    description: 'Akun berhasil dibuat',
                    variant: 'default',
                });
                router.push('/sign-in');
            },
            onError: (error) => {
                toast({
                    title: 'Gagal',
                    description: error.message,
                    variant: 'destructive',
                });
            },
        });
    };

    return (
        <div className="bg-gradient-to-r from-[#CDDFF7] to-[#7FB6FF] overflow-hidden flex w-full h-screen items-center p-16">
            <Card className="py-10 px-16 w-fit bg-white shadow-card-shadow">
                <CardHeader>
                    <CardTitle className="text-4xl font-semibold leading-[48px]">
                        Hallo,
                        <span className="block">Daftar Sekarang</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AutoForm onSubmit={handleSubmit} formSchema={formSchema} className="w-96">
                        <AutoFormSubmit className="w-full">Daftar</AutoFormSubmit>
                        <Separator className="my-6" />
                        <Button variant="outline" className="w-full space-x-2 text-primary">
                            <span className="font-bold">G</span>
                            <span className="font-semibold">Continue with Google</span>
                        </Button>
                    </AutoForm>
                </CardContent>
                <CardFooter className="w-full flex justify-center">
                    <CardDescription>
                        Sudah punya akun? <Link href="/sign-in" className="text-primary font-semibold">Masuk Disini</Link>
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
