import {
  ClientSafeProvider,
  LiteralUnion,
  getCsrfToken,
} from "next-auth/react";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { env } from "@/env/server.mjs";
import { BuiltInProviderType } from "next-auth/providers";
import React from "react"

export default async function Layout({children}:{children: React.ReactNode}) {
  const session = await getServerAuthSession();

  if (session) {
    return redirect("/");
  }

  return (
    <>
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-[#8F5E25]/50 via-[#FBF4A1]/50 to-[#8F5E25]/50 ">
        {children}
      </div>
    </>
  );
}
