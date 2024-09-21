import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth/auth.server";
import Link from "~/components/styled-link";

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await authenticator.isAuthenticated(request);
	if (!user) {
		return redirect("/login");
	} else {
		return json({ user });
	}
}

export default function App() {
	const { user } = useLoaderData<typeof loader>();

	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<h2 className="text-2xl font-medium">main app screen</h2>
			<p className="text-gray-500">logged in as {user.email}</p>
			<Link className="mt-2" to="/logout">
				logout
			</Link>
		</div>
	);
}
