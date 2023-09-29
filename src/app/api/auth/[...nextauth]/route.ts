import NextAuth from "next-auth/next";
import { authOptions} from "@/server/auth";
import { randomUUID, getRandomValues } from "crypto";
import { cookies } from "next/headers"
import {encode, decode, JWTEncodeParams, JWTDecodeParams} from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server";
import { NextAuthOptions } from "next-auth";
// import { setCookie } from "next-auth/src/next/utils.ts";
// import Cookies from "cookies";

// Helper functions to generate unique keys and calculate the expiry dates for session cookies
const generateSessionToken = () => {
    // Use `randomUUID` if available. (Node 15.6++)
    return randomUUID?.() ?? ([1e7].toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (+c ^ getRandomValues(new Uint8Array(1))[0]! & 15 >> +c / 4).toString(16))
}

const fromDate = (time: number, date = Date.now()) => {
    return new Date(date + time * 1000);
};


function handler(req: NextRequest, context:{ params: any }){
    const options:NextAuthOptions = {
      ...authOptions,
      callbacks: {
        ...authOptions.callbacks,
        async signIn({ user, account, profile, credentials }) {
          // Check if this sign in callback is being called in the credentials authentication flow. If so, use the next-auth adapter to create a session entry in the database (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).
          if (
            context.params.nextauth.includes("callback") &&
            context.params.nextauth.includes("credentials") &&
            req.method === "POST"
          ) {
            if (user) {
              const sessionToken = generateSessionToken();
              const sessionExpiry = fromDate(
                authOptions.session?.maxAge ?? 60 * 60 * 24 * 7,
              );

              await authOptions.adapter?.createSession!({
                sessionToken: sessionToken,
                userId: user.id,
                expires: sessionExpiry,
              });


              cookies().set("next-auth.session-token", sessionToken, {
                expires: sessionExpiry,  
              });
            }
          }

          return true;
        },
      },
      jwt: {
        // Customize the JWT encode and decode functions to overwrite the default behaviour of storing the JWT token in the session  cookie when using credentials providers. Instead we will store the session token reference to the session in the database.
        encode: async (params: JWTEncodeParams) => {
          const { token, secret, maxAge } = params;
          if (
            context.params.nextauth.includes("callback") &&
            context.params.nextauth.includes("credentials") &&
            req.method === "POST"
          ) {
            const cookieStore = cookies();
            const cookie = cookieStore.get("next-auth.session-token");
            console.log("JWT Encode cookie:", cookie?.value)
            if (cookie) return cookie.value;
            else return "";
          }
          // Revert to default behaviour when not in the credentials provider callback flow
          return encode({ token, secret, maxAge });
        },
        decode: async (params: JWTDecodeParams) => {
          const { secret, token } = params;
          if (
            context.params.nextauth.includes("callback") &&
            context.params.nextauth.includes("credentials") &&
            req.method === "POST"
          ) {
            console.log("Decoding")
            return null;
          }

          // Revert to default behaviour when not in the credentials provider callback flow
          return decode({ token, secret });
        },
      },
    };
    return NextAuth(req, context, options);
}


export { handler as GET, handler as POST}