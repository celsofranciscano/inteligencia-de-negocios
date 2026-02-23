import { createPool } from "./createPool";

export const db2 = createPool({
  host: process.env.DB2_HOST!,
  user: process.env.DB2_USER!,
  password: process.env.DB2_PASSWORD!,
  database: process.env.DB2_NAME!,
  ssl: process.env.DB2_SSL === "true",
});
