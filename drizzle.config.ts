import { type Config } from "drizzle-kit";

import { env } from "@/env/server.mjs";
import "dotenv/config"

export default {
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  out: "./drizzle",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ["t3_LMS*"],
} satisfies Config;

// export default {
//   schema: "./src/server/db/schema.ts",
//   driver: "mysql2",
//   dbCredentials: {
//     connectionString: env.DATABASE_URL,
//   },
//   tablesFilter: ["t3_project_lang_course_*"],
// } satisfies Config;
