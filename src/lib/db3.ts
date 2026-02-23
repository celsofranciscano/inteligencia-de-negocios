import { createPool } from "./createPool";

export const db3 = createPool({
  host: process.env.DB3_HOST!,
  user: process.env.DB3_USER!,
  password: process.env.DB3_PASSWORD!,
  database: process.env.DB3_NAME!,
  ssl: true, // Neon requiere SSL
});
