import { v4 as uuid } from "uuid";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { accounts, emailVerificationTokens, users } from "@/server/db/schema";
import { Z_EmailRegister } from "./zod";
import { hash } from "bcrypt"
import { z } from "zod";
import { DrizzleError, and, eq, lte, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import sendVerificationMail from "@/server/react-email/emails/verify-email";

const findUser = db.select({id: users.id}).from(users).limit(1).where(eq(users.email, sql.placeholder("email"))).prepare()
const findEmailToken = db.select({verified: users.emailVerified}).from(users).innerJoin(emailVerificationTokens, eq(users.id, emailVerificationTokens.userId)).limit(1).where(eq(emailVerificationTokens.token, sql.placeholder("token"))).prepare()

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(Z_EmailRegister)
    .mutation(async ({ ctx, input }) => {
        const userExists = await findUser.execute({email: input.email})
        // console.log(userExists.le >  0)
        if (userExists.length > 0 ){
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "User with this email already exists. Try to reset your password if this is your email and you already have an account."
            })
        }

        const id = uuid()
        const hashed = await hash(input.password, 10)
        try {
            const transaction = await ctx.db.transaction( async (tx) => {
                await tx.insert(users).values({
                    email: input.email,
                    id: id,
                    password: hashed,
                    emailVerified: null
                })
    
                await tx.insert(accounts).values({
                  provider: "credentials-auth",
                  providerAccountId: input.email,
                  type: "credentials",
                  userId: id,
                });

                const now = new Date()
                // console.log(now)
                const verificationToken = uuid()
                const expiration = new Date(now.setDate( now.getDate() + 7))
                await tx.insert(emailVerificationTokens).values({
                    expires: expiration,
                    token: verificationToken,
                    userId: id
                })
                
                const newUser = await tx.query.users.findFirst({
                    where: (users, { eq }) => eq(users.id, id),
                    columns:{
                        email: true,
                        id: true,
                        image: true,
                        name:true,
                    },
    
                })
                // console.log(newUser)
                return {user: newUser, verificationToken: verificationToken} 
    
            })

            sendVerificationMail(transaction.verificationToken, input.email)
            console.log("Transaction", transaction)
            return transaction?.user ?? null
        } catch (err){
            if (err instanceof DrizzleError){
                console.error(err)
                throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: err.message})
            }
        }
    }),
  verify_email: publicProcedure
    .input(z.object({
        token: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
        
        // const hashed =  await hash(input.password, 10)
        const emailToken = await findEmailToken.execute({token: input.token})
        if (emailToken[0]?.verified) {
            return {success: true, code: "Account is already verified."}
        }
        const transaction = await ctx.db.transaction( async (tx) => {
            const emailToken = await ctx.db.query.emailVerificationTokens.findFirst({
                where: eq(emailVerificationTokens.token, input.token)
            })

            if (!emailToken){
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "Token to verify email does not exist."
                })
            }
            const now = new Date()
            if (emailToken.expires < now){
                return { success: false, code: "too old" as const}
            }
            
            await tx.update(users).set({
                emailVerified: now
            }).where(eq(users.id, emailToken.userId))

            const updatedUser = await tx.query.users.findFirst({where: eq(users.id, emailToken.userId)})

            if (!updatedUser){
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: "User does not exist"
                })
            }

            return { success: updatedUser.emailVerified?.getTime() === now.getTime() }
        })

        return transaction
    }),
})



  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
// });
