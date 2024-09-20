import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({ url: process.env.DB_URL! });

export const db = drizzle(client);

export * as schema from "./schema";
