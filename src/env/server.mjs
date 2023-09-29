import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import validator from "validator";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    HOST: z.string().regex(/(\d+.\d+.\d+.\d+)|(localhost)/),
    PORT: z.coerce.number(),
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string(),
    DATABASE_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    AZURE_AD_B2C_TENANT_NAME: z.string(),
    AZURE_AD_B2C_CLIENT_ID: z.string(),
    AZURE_AD_B2C_CLIENT_SECRET: z.string(),
    AZURE_AD_B2C_PRIMARY_USER_FLOW: z.string(),
    EMAIL_SERVER_USER: z.string(),
    EMAIL_SERVER_PASSWORD: z.string(),
    EMAIL_SERVER_HOST: z.string(),
    EMAIL_SERVER_PORT: z.coerce.number(),
    EMAIL_FROM: z.string().email(),
    //TRIAL
    // AZURE_AD_CLIENT_ID: z.string(),
    // AZURE_AD_CLIENT_SECRET: z.string(),
    // AZURE_AD_TENANT_ID: z.string(),
  },
  runtimeEnv: process.env,
});
