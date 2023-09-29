// "use client"
import SessionProvider from "@/server/authProvider"
import { getServerSession } from "next-auth";
import "@/styles/globals.css";
import TRPCAppRouterProvider from "@/server/api/Provider";
import NavBar from "@/components/navBar";
import { ThemeProvider } from "@/components/themeProvider";
import {Montserrat, Work_Sans} from "next/font/google"


const work_sans = Work_Sans({
  display: "auto",
  subsets: ["latin-ext"],
  variable: "--font-work_sans",
});

const montserrat = Montserrat({
  display: "auto",
  subsets: ["latin-ext"],
  variable: "--font-montserrat"
})

export default async function RootLayout ({
    children
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession();
    return (
      <>
        <html>
          <TRPCAppRouterProvider>
            <SessionProvider session={session}>
              <head></head>
              
              <body
                className={`h-screen w-screen ${work_sans.variable} ${montserrat.variable} font-body flex flex-col overflow-y-auto overflow-x-hidden`}
              >
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <header className="sticky top-0 inline-flex h-fit w-full justify-center bg-inherit shadow-md dark:shadow-neutral-200/10 z-10">
                    <NavBar />
                  </header>
                  <main className="max-w-screen-2xl flex flex-grow flex-col justify-center items-center">{children}</main>
                  <footer></footer>
                </ThemeProvider>
              </body>
            </SessionProvider>
          </TRPCAppRouterProvider>
        </html>
      </>
    );
}
