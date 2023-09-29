import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type GetServerSidePropsContext } from "next";
import {
getServerSession,
type DefaultSession,
type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { env } from "@/env/server.mjs";
import { db } from "@/server/db";
import { mysqlTable, users } from "@/server/db/schema";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { ZodError, z } from "zod";
import { compare } from "bcrypt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
interface Session extends DefaultSession {
	user: {
	id: string;
	// ...other properties
	// role: UserRole;
	} & DefaultSession["user"];
}

// interface User {
//   // ...other properties
//   // role: UserRole;
// }
}

const lookUpUsers = db.select().from(users).where(eq(users.email, sql.placeholder("email"))).prepare()
export const Z_EmailLogin = z.object({
email: z.string().email(),
password: z
	.string()
});


/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	callbacks: {
		session: ({ session, user }) => ({
			...session,
			user: {
				...session.user,
				id: user.id,
			},
		}),
		// jwt: ({token, account, user}) => {
		// if (account) {
		// 	token.accessToken = account.access_token
		// 	token.id = user.id
		// }
		// return token
		// }
	},
	// session: {
	// 	strategy: "database"
	// },
	adapter: DrizzleAdapter(db, mysqlTable),
	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			authorization: {
			params: {
				prompt: "consent",
				access_type: "offline",
				response_type: "code",
			},
			},
		}),
		AzureADB2CProvider({
			tenantId: env.AZURE_AD_B2C_TENANT_NAME,
			clientId: env.AZURE_AD_B2C_CLIENT_ID,
			clientSecret: env.AZURE_AD_B2C_CLIENT_SECRET,
			primaryUserFlow: env.AZURE_AD_B2C_PRIMARY_USER_FLOW,
			authorization: { params: { scope: "offline_access openid" } },
			// checks:["pkce"],
			// client: {
			//   token_endpoint_auth_method: "none"
			// }
		}),
		CredentialsProvider({
			name: "credentials",
			credentials: {
			email: {
				label: "Emaill",
				type: "email",
				placeholder: "john@smith.com",
			},
			password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try{
					if (!credentials?.email) return null
					const { email, password } = Z_EmailLogin.parse(credentials)

					const users = await lookUpUsers.execute({email: email})
					const user = users.find(async (e) => e.password && await compare(password, e.password) && !!e.emailVerified)

					if (!user) return null
					const { password: _, emailVerified:__, ...returnUser} = user
					console.log("Returning user", returnUser)
					return returnUser

				} catch (err){
					if (err instanceof ZodError) {
						console.error(err.flatten())
					} else {
						console.error(err)
					}

					return null
				}
			},

		//   secret: env.NEXTAUTH_SECRET,
		//   jwt: {
		//     secret: env.NEXTAUTH_SECRET,
		//     encryption: true,
		//   },
		}),

		/**
		 * ...add more providers here.
		 *
		 * Most other providers require a bit more work than the Discord provider. For example, the
		 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
		 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
		 *
		 * @see https://next-auth.js.org/providers/github
		 */
	],
	secret: env.NEXTAUTH_SECRET,
	debug: !(env.NODE_ENV === "production"),
	pages: {
		signIn: "/auth/signin",
	}

};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSessionTRPC = (ctx: {
	req: GetServerSidePropsContext["req"];
	res: GetServerSidePropsContext["res"];
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions);
};

export const getServerAuthSession = () => {
	return getServerSession(authOptions);
};
