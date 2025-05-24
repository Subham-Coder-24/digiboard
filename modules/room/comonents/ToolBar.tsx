import { useSetOptions } from "@/common/recoil/options/options.hooks";

export const ToolBar = () => {
	const setOptions = useSetOptions();

	const colors = [
		{
			name: "Red",
			value: "red",
			bg: "bg-red-600",
			hover: "hover:bg-red-700",
		},
		{
			name: "Green",
			value: "green",
			bg: "bg-green-600",
			hover: "hover:bg-green-700",
		},
		{
			name: "Black",
			value: "black",
			bg: "bg-gray-800",
			hover: "hover:bg-black",
		},
		{
			name: "Pink",
			value: "pink",
			bg: "bg-pink-500",
			hover: "hover:bg-pink-600",
		},
	];

	return (
		<div className="absolute left-0 top-0 z-50 flex gap-5 bg-black text-white p-2">
			{colors.map(({ name, value, bg, hover }) => (
				<button
					key={value}
					onClick={() =>
						setOptions((prev) => ({ ...prev, lineColor: value }))
					}
					className={`px-4 py-2 ${bg} ${hover} rounded`}
				>
					{name}
				</button>
			))}
		</div>
	);
};
