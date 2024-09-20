import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await authenticator.isAuthenticated(request);
	if (!user) {
		return redirect("/login");
	}

	return json({ user });
}

export default function App() {
	const { user } = useLoaderData<typeof loader>();

	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<p>hello, {user.username}</p>
			<Link
				className="text-indigo-500 underline underline-offset-2 hover:text-indigo-600"
				to="/logout"
			>
				logout
			</Link>
		</div>
	);
}
