import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { appRouter } from "@/server/api/root"
import { getServerAuthSession } from "@/server/auth"
import { db } from "@/server/db"

const handler = (req: Request) => fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
        return {
        session: await getServerAuthSession(),
        db: db
    }},
    onError: (opts) => {
        const { error, type, path, input, ctx, req } = opts;
        console.error("Error:", error);
        if (error.code === "BAD_REQUEST"){
            //
        }

    }
})

export { handler as GET, handler as POST}