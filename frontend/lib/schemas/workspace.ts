import * as z from "zod";

export const workspaceSchema = z.object({
  name: z.string().trim().min(1, "Workspace name is required"),
  slug: z
    .string()
    .trim()
    .min(1, "URL slug is required")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers and hyphens"),
  colour: z.string().min(1),
});

export const inviteMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Enter a valid email"),
  role: z.enum(["Member", "Admin"]),
});

export type WorkspaceValues = z.infer<typeof workspaceSchema>;
export type InviteMemberValues = z.infer<typeof inviteMemberSchema>;
