import { z } from "zod";
import { zfd } from "zod-form-data";

export const loginSchema = zfd
	.formData({
		identifier: zfd.text(z.string().optional()),
		username: zfd.text(z.string().optional()),
		password: zfd.text(z.string({ message: "Password is required." })),
	})
	.refine((data) => data.identifier || data.username, {
		message: "Either username or email is required.",
		path: ["identifier"],
	});

export const signupSchema = zfd.formData({
	email: zfd.text(z.string().email("Email address is invalid.")),
	username: z.string().min(3, "Username must be at least 3 characters long."),
	password: z.string().min(8, "Password must be at least 8 characters long."),
});
