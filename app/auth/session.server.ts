import { createSessionStorage } from "@remix-run/node";
import { User } from "./auth.server";
import { db, schema } from "~/db";
import { eq } from "drizzle-orm";

export const sessionStorage = createSessionStorage<{ user: User }>({
	cookie: {
		name: "_session",
		sameSite: "lax",
		path: "/",
		httpOnly: true,
		secrets: [process.env.SESSION_SECRET!],
		maxAge: 60 * 60 * 24 * 30, // 30 days
	},

	createData: async (data, expires) => {
		if (!data.user) {
			throw new Error("User not found");
		}

		if (!expires) {
			throw new Error("Expires not found");
		}

		const session = await db
			.insert(schema.sessions)
			.values({ id: crypto.randomUUID(), userId: data.user.id, expiresAt: expires.getTime() })
			.returning({ id: schema.sessions.id })
			.get();

		return session.id;
	},
	readData: async (id) => {
		console.log("reading session", id);
		const result = await db
			.select({
				sessionId: schema.sessions.id,
				userId: schema.users.id,
				userEmail: schema.users.email,
			})
			.from(schema.sessions)
			.where(eq(schema.sessions.id, id))
			.innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
			.get();

		if (!result) return null;

		return {
			user: {
				id: result.userId,
				email: result.userEmail,
			},
		};
	},
	updateData: async (id) => {
		console.log("updating session", id);
		await db
			.update(schema.sessions)
			.set({ expiresAt: Date.now() + 60 * 60 * 24 * 30 * 1000 })
			.where(eq(schema.sessions.id, id));
	},
	deleteData: async (id) => {
		console.log("deleting session", id);
		await db.delete(schema.sessions).where(eq(schema.sessions.id, id));
	},
});

export const { getSession, commitSession, destroySession } = sessionStorage;
