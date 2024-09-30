import { Link, LinkProps } from "@remix-run/react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const buttonStyles = clsx(
	"flex h-9 items-center justify-center",
	"rounded-md px-3 py-1.5 text-sm",
	"font-medium leading-6 tracking-wider text-white",
	"bg-primary-600 hover:bg-primary-500",
	"transition-colors duration-200",
	"shadow-sm shadow-primary-600/30",
	"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600",
	"pointer-coarse:text-base pointer-coarse:h-input",
);

export function Button({ className, ...props }: ButtonProps) {
	return <button className={clsx(buttonStyles, className)} {...props} />;
}

export function ButtonLink({ className, ...props }: LinkProps) {
	return <Link className={clsx(buttonStyles, className)} {...props} />;
}
