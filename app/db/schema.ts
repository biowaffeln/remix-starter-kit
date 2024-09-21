import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
});

export const sessions = sqliteTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.references(() => users.id)
		.notNull(),
	createdAt: integer("created_at")
		.default(sql`(strftime('%s', 'now'))`)
		.notNull(),
	expiresAt: integer("expires_at").notNull(),
});
