import { z } from "zod"

export const resetEmailSchema = z.object({
    email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format"),
});

export type resetEmailSchemaType = z.infer<typeof resetEmailSchema>;
