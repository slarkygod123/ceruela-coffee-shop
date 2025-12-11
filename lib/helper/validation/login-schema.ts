import { z } from "zod"

export const loginSchema = z.object({
    email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid Email"),
    password: z.string().trim().min(1, "Password is required"),
});

export type loginSchemaType = z.infer<typeof loginSchema>;
