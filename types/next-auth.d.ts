// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string; // number → string に変更
            email?: string | null;
        };
    }
}
