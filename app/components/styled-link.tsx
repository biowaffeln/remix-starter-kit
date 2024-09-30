import { Link as RemixLink, LinkProps } from "@remix-run/react";
import clsx from "clsx";

export function Link({ className, ...props }: LinkProps) {
	return (
		<RemixLink
			className={clsx(
				"text-primary-500 underline underline-offset-2 hover:text-primary-600",
				"transition-colors duration-100",
				className,
			)}
			{...props}
		/>
	);
}
