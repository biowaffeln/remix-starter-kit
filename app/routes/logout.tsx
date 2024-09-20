import { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/auth/auth.server";

export async function loader({ request }: ActionFunctionArgs) {
	await authenticator.logout(request, { redirectTo: "/" });
}
