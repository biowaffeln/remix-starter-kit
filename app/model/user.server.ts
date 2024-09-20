import { db, schema } from "~/db";
import { createHash, randomUUID } from "crypto";
import { and, eq, or } from "drizzle-orm";

function hashPassword(password: string) {
	return createHash("sha256").update(password).digest("hex");
}

export class UserError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UserError";
	}
}

export async function createUser({
	email,
	password,
	username,
}: {
	email: string;
	password: string;
	username: string;
}) {
	const existingUser = await db
		.select()
		.from(schema.users)
		.where(or(eq(schema.users.email, email), eq(schema.users.username, username)))
		.get();

	if (existingUser) {
		if (existingUser.email === email) {
			throw new UserError("Email already exists");
		}
		if (existingUser.username === username) {
			throw new UserError("Username already exists");
		}
	}

	const user = await db
		.insert(schema.users)
		.values({ id: randomUUID(), email, password: hashPassword(password), username })
		.returning()
		.get();

	return user;
}

export async function verifyUser({
	identifier,
	password,
}: {
	identifier: string;
	password: string;
}) {
	const user = await db
		.select()
		.from(schema.users)
		.where(
			and(
				or(eq(schema.users.email, identifier), eq(schema.users.username, identifier)),
				eq(schema.users.password, hashPassword(password)),
			),
		)
		.get();

	if (!user) {
		throw new UserError("Invalid username/email or password");
	}

	return {
		id: user.id,
		email: user.email,
		username: user.username,
	};
}
