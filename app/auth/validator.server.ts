import { z } from "zod";
import { zfd } from "zod-form-data";

export const loginSchema = zfd.formData({
	email: zfd.text(z.string().email("Email address is invalid.")),
	password: zfd.text(z.string({ message: "Password is required." })),
});

export const signupSchema = zfd.formData({
	email: zfd.text(z.string().email("Email address is invalid.")),
	password: z.string().min(8, "Password must be at least 8 characters long."),
});
