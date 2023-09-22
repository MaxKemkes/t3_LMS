// import { FetchCreateContextFnOptions, fetchRequestHandler } from "@trpc/server/adapters/fetch"
// import { appRouter } from "@/trpc/server"
// import { NextApiRequest, NextApiResponse } from "next";
// import { createTRPCContext } from "@/trpc/server/trpc";


// const handler = (req: NextApiRequest & Request, res: NextApiResponse) =>
//   fetchRequestHandler({
//     endpoint: "api/trpc/",
//     req,
//     router: appRouter,
//     createContext: createTRPCContext({req: req, res: res})
//   });

// export {handler as GET, handler as POST};