import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { ZodError } from "zod";
import { AuthorizationError } from "remix-auth";
import { match, P } from "ts-pattern";
import { authenticator } from "~/auth/auth.server";
import { UserError } from "~/auth/user.server";
import Button from "~/components/button";
import Input from "~/components/input";
import Link from "~/components/styled-link";
import Alert from "~/components/alert";

export async function loader({ request }: LoaderFunctionArgs) {
	return await authenticator.isAuthenticated(request, {
		successRedirect: "/app",
	});
}

export async function action({ request }: LoaderFunctionArgs) {
	try {
		await authenticator.authenticate("user-pass", request, {
			successRedirect: "/app",
			throwOnError: true,
		});
	} catch (result) {
		return match(result)
			.with(P.instanceOf(Response), (response) => response as never)
			.with(P.instanceOf(AuthorizationError), (error) =>
				match(error.cause)
					.with(P.instanceOf(ZodError), (zodError) =>
						json({ errors: zodError.errors.map((error) => error.message) }),
					)
					.with(P.instanceOf(UserError), (userError) => json({ error: userError.message }))
					.otherwise(() => json({ error: error.message })),
			)
			.otherwise((unknownError) => {
				console.error(unknownError);
				return json({ error: `An unexpected error occurred. Please try again.` });
			});
	}
}

export default function Login() {
	const actionData = useActionData<typeof action>();

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="flex w-full max-w-lg flex-col gap-10 px-4 sm:px-16">
				<h1 className="text-center text-2xl font-semibold">Log in to your account</h1>
				<Form method="post" className="mx-auto flex w-full flex-col gap-6">
					<div className="flex flex-col gap-2">
						<label htmlFor="email" className="sr-only">
							Email
						</label>
						<Input type="email" name="email" id="email" placeholder="Email" required />
						<label htmlFor="password" className="sr-only">
							Password
						</label>
						<Input type="password" name="password" id="password" placeholder="Password" />
					</div>
					<Button type="submit">Login</Button>
				</Form>
				{match(actionData)
					.with({ errors: P.select() }, (errors) => <Alert messages={errors} />)
					.with({ error: P.select() }, (error) => <Alert messages={[error]} />)
					.otherwise(() => null)}
				<p className="text-center text-sm">
					<span className="text-gray-700">Don’t have an account?</span>{" "}
					<Link to="/signup">Sign up</Link>
				</p>
			</div>
		</div>
	);
}
