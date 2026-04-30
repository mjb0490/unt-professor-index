import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // This tells the client where your Next.js server is running
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
});