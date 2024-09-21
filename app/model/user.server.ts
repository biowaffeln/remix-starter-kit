import { db, schema } from "~/db";
import { createHash, randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";

function hashPassword(password: string) {
	return createHash("sha256").update(password).digest("hex");
}

export class UserError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UserError";
	}
}

export async function createUser({ email, password }: { email: string; password: string }) {
	const existingUser = await db
		.select()
		.from(schema.users)
		.where(eq(schema.users.email, email))
		.get();

	if (existingUser) {
		throw new UserError("Email already exists");
	}

	const user = await db
		.insert(schema.users)
		.values({ id: randomUUID(), email, password: hashPassword(password) })
		.returning()
		.get();

	return user;
}

export async function verifyUser({ email, password }: { email: string; password: string }) {
	const user = await db
		.select()
		.from(schema.users)
		.where(and(eq(schema.users.email, email), eq(schema.users.password, hashPassword(password))))
		.get();

	if (!user) {
		throw new UserError("Invalid email or password.");
	}

	return {
		id: user.id,
		email: user.email,
	};
}
