import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage } from "~/auth/session.server";
import { verifyUser } from "~/auth/user.server";
import { loginSchema } from "~/auth/validator.server";
import type { User } from "~/auth/user.server";

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
	new FormStrategy(async ({ form }) => {
		const user = loginSchema.parse(form);
		return verifyUser({ email: user.email, password: user.password });
	}),
	"user-pass",
);
