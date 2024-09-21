import { XCircleIcon } from "@heroicons/react/20/solid";

export default function Alert({ messages }: { messages: string[] }) {
	return (
		<div className="rounded-md border border-red-200 bg-red-50 p-4">
			<div className="flex">
				<div className="flex-shrink-0">
					<XCircleIcon aria-hidden="true" className="h-5 w-5 text-red-400" />
				</div>
				<div className="ml-3">
					<h3 className="text-sm font-medium text-red-800">
						{messages.length === 1
							? "There was an error with your submission"
							: `There were ${messages.length} errors with your submission`}
					</h3>
					<div className="mt-2 text-sm text-red-700">
						<ul className="list-disc space-y-1 pl-5">
							{messages.map((message, index) => (
								<li key={index}>{message}</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
