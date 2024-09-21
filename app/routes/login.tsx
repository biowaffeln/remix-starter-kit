import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { authenticator } from "~/auth/auth.server";
import { ZodError } from "zod";
import { AuthorizationError } from "remix-auth";
import { UserError } from "~/model/user.server";

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
		if (result instanceof Response) return result as never;

		if (result instanceof AuthorizationError) {
			if (result.cause instanceof ZodError) {
				return json({ error: result.cause.errors[0].message });
			}
			if (result.cause instanceof UserError) {
				return json({ error: result.cause.message });
			}
			return json({ error: result.message });
		}

		console.error(result);
		return json({ error: `An unexpected error occurred. Please try again.` });
	}
}

export default function Login() {
	const actionData = useActionData<typeof action>();

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<div className="w-full max-w-md">
				<h1 className="mb-6 text-center text-2xl font-semibold">Login</h1>
				<Form method="post" className="flex flex-col gap-6">
					<div className="flex flex-col gap-1">
						<label htmlFor="email" className="sr-only">
							<span className="text-gray-700">Email:</span>
						</label>
						<input
							type="email"
							name="email"
							id="email"
							placeholder="Email"
							required
							className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 focus:border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-200"
						/>
						<label htmlFor="password" className="sr-only">
							<span className="text-gray-700">Password:</span>
						</label>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="Password"
							className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 focus:border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-200"
						/>
					</div>
					<button
						type="submit"
						className="w-full rounded-md bg-indigo-500 px-4 py-2 text-white transition-colors hover:bg-indigo-600"
					>
						Login
					</button>
				</Form>
				<p className="mt-4 text-center text-sm">
					<span className="text-gray-700">Don’t have an account?</span>{" "}
					<Link to="/signup" className="text-indigo-500 hover:text-indigo-600">
						Sign up
					</Link>
				</p>
				{actionData?.error && (
					<p className="mt-8 rounded-md border border-red-200 bg-red-100 px-4 py-3 text-sm text-red-500">
						{actionData?.error}
					</p>
				)}
			</div>
		</div>
	);
}
