import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import validator from "validator";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    HOST: z.string().regex(/(\d+.\d+.\d+.\d+)|(localhost)/),
    PORT: z.coerce.number(),
    DATABASE_URL: z.string().url(),
    
  },
  runtimeEnv: process.env,
});
