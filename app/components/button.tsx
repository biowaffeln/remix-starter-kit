type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

import clsx from "clsx";

export default function Button({ className, ...props }: ButtonProps) {
	return (
		<button
			className={clsx(
				"flex w-full items-center justify-center rounded-md px-3 py-1.5",
				"h-10",
				"sm:h-9 sm:text-sm",
				"font-medium leading-6 tracking-wider text-white shadow-sm",
				"bg-primary-600 transition-colors duration-100 hover:bg-primary-500",
				"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600",
				className,
			)}
			{...props}
		/>
	);
}
