import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
	return (
		<input
			className={clsx(
				"block h-10 w-full rounded-md border-0 py-1.5 shadow-sm",
				"ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600",
				"text-sm text-gray-900 placeholder:text-gray-400",
				"pointer-coarse:h-input pointer-coarse:text-base",
				className,
			)}
			{...props}
		/>
	);
}
