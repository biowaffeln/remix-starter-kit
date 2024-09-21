import { createCookie, createSessionStorage } from "@remix-run/node";
import { db, schema } from "~/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { User } from "~/auth/user.server";

const days = (n: number) => n * 24 * 60 * 60 * 1000;

const EXPIRATION = days(14);
const EXPIRATION_MS = EXPIRATION * 1000;
const EXPIRATION_THRESHOLD_MS = days(7);
const SESSION_NAME = "_session";

export const sessionStorage = createSessionStorage<{ user: User }>({
	cookie: {
		name: SESSION_NAME,
		sameSite: "lax",
		path: "/",
		httpOnly: true,
		secrets: [process.env.SESSION_SECRET!],
		maxAge: EXPIRATION,
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
			.values({ id: randomUUID(), userId: data.user.id, expiresAt: expires.getTime() })
			.returning({ id: schema.sessions.id })
			.get();

		return session.id;
	},
	readData: async (id) => {
		const result = await db
			.select({
				sessionId: schema.sessions.id,
				userId: schema.users.id,
				userEmail: schema.users.email,
				expiresAt: schema.sessions.expiresAt,
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
				expiresAt: result.expiresAt,
			},
		};
	},
	updateData: async (id) => {
		await db
			.update(schema.sessions)
			.set({ expiresAt: Date.now() + EXPIRATION_MS })
			.where(eq(schema.sessions.id, id));
	},
	deleteData: async (id) => {
		await db.delete(schema.sessions).where(eq(schema.sessions.id, id));
	},
});

const cookie = createCookie(SESSION_NAME, {});
export async function clearSession() {
	return {
		headers: {
			"Set-Cookie": await cookie.serialize("", { maxAge: 0 }),
		},
	};
}

export async function handleSessionExpiration(user: User, request: Request) {
	if (user.expiresAt - Date.now() < EXPIRATION_THRESHOLD_MS) {
		const session = await getSession(request.headers.get("Cookie"));
		return {
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		};
	}
}

export const { getSession, commitSession, destroySession } = sessionStorage;
