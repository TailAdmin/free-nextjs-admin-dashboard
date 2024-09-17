import { z } from "zod";

const privateConfigSchema = z.object({

    // AUTH_GITHUB_ID: z.string().optional(),
    // AUTH_GITHUB_CLIENT_SECRET: z.string().optional(), 

    NEXTAUTH_URL: z.string().optional(),
    AUTH_AUTH0_CLIENT_ID: z.string().optional(),
    AUTH_AUTH0_CLIENT_SECRET: z.string().optional(),
    AUTH_AUTH0_DOMAIN: z.string().optional(),
    

});

export const privateConfig = privateConfigSchema.parse(process.env);