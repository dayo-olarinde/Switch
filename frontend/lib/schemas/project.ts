import * as z from "zod";

export const projectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required"),
  description: z.string(),
  icon: z.string().min(1, "Choose an icon"),
});

export type ProjectValues = z.infer<typeof projectSchema>;
