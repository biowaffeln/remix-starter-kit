import type { MetaFunction } from "@remix-run/node";
import { ButtonLink } from "~/components/button";

export const meta: MetaFunction = () => {
	return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<h2 className="text-2xl font-medium">landing page screen</h2>
			<div className="mt-6 flex gap-3">
				<ButtonLink to="/login">login</ButtonLink>
				<ButtonLink to="/signup">signup</ButtonLink>
			</div>
		</div>
	);
}
