import { z } from "zod"

const passwordSchema = z.string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." })
    .refine((val) => !val.includes(' '), {
    message: "Password cannot contain spaces"
    });

export const registerationSchema = z.object({
    email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format"),
    password: passwordSchema,
    confirmPassword: z.string(),
    })  
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password do not match",
        path: ['confirmPassword']
    })

export type registerationSchemaType = z.infer<typeof registerationSchema>;  