import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/database/db_schema.tsx",
  out: "./drizzle",
  dbCredentials: {
    url: "stemm.db",
  },
});