// lib/validations/change-password-schema.ts
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

export const resetPasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    password: passwordSchema,
    confirmPassword: z.string(),
})  
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword']
})
.refine((data) => data.currentPassword !== data.password, {
    message: "New password must be different from current password",
    path: ['password']
});

export type resetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;