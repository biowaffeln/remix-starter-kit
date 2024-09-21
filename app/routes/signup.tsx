import { Form, useActionData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { match, P } from "ts-pattern";
import { ZodError } from "zod";
import { authenticator } from "~/auth/auth.server";
import { createUser, UserError } from "~/auth/user.server";
import { signupSchema } from "~/auth/validator.server";
import Alert from "~/components/alert";
import Button from "~/components/button";
import Input from "~/components/input";
import Link from "~/components/styled-link";

export async function action({ request }: LoaderFunctionArgs) {
	try {
		const form = await request.clone().formData();
		await createUser(signupSchema.parse(form));
		await authenticator.authenticate("user-pass", request, {
			successRedirect: "/app",
			throwOnError: true,
		});
	} catch (result) {
		return match(result)
			.with(P.instanceOf(Response), (response) => response as never)
			.with(P.instanceOf(ZodError), (zodError) =>
				json({ errors: zodError.errors.map((error) => error.message) }),
			)
			.with(P.instanceOf(UserError), (userError) => json({ error: userError.message }))
			.otherwise((unknownError) => {
				console.error(unknownError);
				return json({ error: `An unexpected error occurred. Please try again.` });
			});
	}
}

export async function loader({ request }: LoaderFunctionArgs) {
	return await authenticator.isAuthenticated(request, {
		successRedirect: "/app",
	});
}

export default function Signup() {
	const actionData = useActionData<typeof action>();

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="flex w-full max-w-lg flex-col gap-10 px-4 sm:px-16">
				<h1 className="text-center text-2xl font-semibold">Sign up for an account</h1>
				<Form method="post" className="mx-auto flex w-full flex-col gap-6">
					<div className="flex flex-col gap-2">
						<label htmlFor="email" className="sr-only">
							Email
						</label>
						<Input type="email" name="email" id="email" placeholder="Email" required />
						<label htmlFor="password" className="sr-only">
							Password
						</label>
						<Input
							type="password"
							name="password"
							id="password"
							placeholder="Password"
							required
							minLength={8}
						/>
					</div>
					<Button type="submit">Sign Up</Button>
				</Form>
				{match(actionData)
					.with({ errors: P.select() }, (errors) => <Alert messages={errors} />)
					.with({ error: P.select() }, (error) => <Alert messages={[error]} />)
					.otherwise(() => null)}
				<p className="text-center text-sm">
					<span className="text-gray-700">Already have an account?</span>{" "}
					<Link to="/login">Log in</Link>
				</p>
			</div>
		</div>
	);
}
