import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
	return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<p className="mb-2">hello world</p>
			<Link
				className="text-indigo-500 underline underline-offset-2 hover:text-indigo-600"
				to="/login"
			>
				login
			</Link>
			<Link
				className="text-indigo-500 underline underline-offset-2 hover:text-indigo-600"
				to="/signup"
			>
				signup
			</Link>
		</div>
	);
}
