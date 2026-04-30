import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from '@/lib/db'; // Assuming your snippet is in db.ts
import * as schema from "@/db/schema";
import { createAuthMiddleware, APIError } from "better-auth/api";

export const auth = betterAuth({
    baseURL: "http://localhost:3001",
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            // Block sign-ups that don't use the UNT domain
            if (ctx.path === "/sign-up/email") {
                const { email } = ctx.body as { email?: string };
                if (!email?.endsWith("@my.unt.edu")) {
                    throw new APIError("BAD_REQUEST", {
                        message: "Only @my.unt.edu emails are allowed.",
                    });
                }
            }
        }),
    },
});