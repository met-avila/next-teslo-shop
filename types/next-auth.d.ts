import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
    interface JWT {
        userId?: string;
        role?: string;
    }
}

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the
     * `SessionProvider` React Context and trpc context
     */
    interface Session {
        user?: {
            id?: string;
            role?: string;
        } & DefaultSession["user"];
    }

    /** Passed as a parameter to the `jwt` callback */
    interface User {
        id?: string;
        role?: string;
    }
}