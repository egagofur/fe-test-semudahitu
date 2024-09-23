import { z } from 'zod';

export const formSchema = z.object({
    fullname: z.string(),
    companyName: z.string().min(6),
    mobilePhoneNumber: z.string().min(10),
    email: z.string().email(),
    password: z.string().min(8),
});

export type TFormSchema = z.infer<typeof formSchema>;
