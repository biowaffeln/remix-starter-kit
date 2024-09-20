import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./app/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: process.env.DB_URL!,
	},
});
