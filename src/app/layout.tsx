// "use client"
import { type Session } from "next-auth";
import SessionProvider from "@/server/authProvider"
import { getServerSession } from "next-auth";
import { type AppType } from "next/app";
import "@/styles/globals.css";
import type { Metadata } from "next";

import { api } from "@/utils/api";
import Provider from "@/server/api/Provider";

export default async function RootLayout ({
    children
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession();
    return (
      <>
        <Provider>
          <SessionProvider session={session}>
            <html>
              <head></head>
              <body>
                <header></header>
                {children}
                <footer></footer>
              </body>
            </html>
          </SessionProvider>
        </Provider>
      </>
    );
}
