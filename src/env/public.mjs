import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import validator from "validator";

export const env = createEnv({
  clientPrefix: "NEXT_PUBLIC",
  client: {
    NEXT_PUBLIC_SITE_URL: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
});
