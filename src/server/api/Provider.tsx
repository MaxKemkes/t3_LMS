"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import React, {useState} from "react"
import { trpcAPI } from "@/utils/api"
import SuperJSON from "superjson"


const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};


export default function TRPCAppRouterProvider({children}:{children:React.ReactNode}){
    const [queryClient] = useState(() => new QueryClient({}));
    const [trpcClient] = useState(() =>
      trpcAPI.createClient({
        links: [
          httpBatchLink({
            url: getBaseUrl() + "/api/trpc",
          }),
        ],
        transformer: SuperJSON,
      }),
    );

    return (
        <trpcAPI.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpcAPI.Provider>
    )
}

export function TRPCPageRouterProvider
({children}:{children:React.ReactNode}){
    const [queryClient] = useState(() => new QueryClient({}));
    const [trpcClient] = useState(() =>
      trpcAPI.createClient({
        links: [
          httpBatchLink({
            url: getBaseUrl() + "/api/trpc",
          }),
        ],
        transformer: SuperJSON,
      }),
    );

    return (
        <trpcAPI.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpcAPI.Provider>
    )
}