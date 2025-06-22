import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { HexColorPicker, RgbaColorPicker } from "react-colorful";
import { BsPaletteFill } from "react-icons/bs";
import { useClickAway } from "react-use";

import { EntryAnimation } from "../../animations/Entry.animations";
import { useOptions } from "@/common/recoil/options";
import { getStringFromRgba } from "@/common/lib/rgba";

const ColorPicker = () => {
	const [options, setOptions] = useOptions();

	const ref = useRef<HTMLDivElement>(null);

	const [opened, setOpened] = useState(false);

	useClickAway(ref, () => setOpened(false));
	type RgbaColor = {
		r: number;
		g: number;
		b: number;
		a: number;
	};

	function rgbaToString(color: RgbaColor): string {
		return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
	}

	console.log("options.lineColor", options.lineColor);

	return (
		<div className="relative flex items-center" ref={ref}>
			<button
				className="h-7 w-7 rounded-md border-2 border-white transition-all "
				// disabled={options.mode === "select"}
				style={{
					backgroundColor: rgbaToString(options.lineColor),
				}}
				onClick={() => setOpened(!opened)}
			>
				<AnimatePresence>
					{opened && (
						<motion.div
							className="absolute top-0 left-14"
							variants={EntryAnimation}
							initial="from"
							animate="to"
							exit="from"
						>
							<RgbaColorPicker
								color={options.lineColor}
								onChange={(e) => {
									setOptions((prev) => ({
										...prev,
										lineColor: e,
									}));
								}}
								className="mb-5"
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</button>
		</div>
	);
};

export default ColorPicker;

// import { useSetOptions } from "@/common/recoil/options/options.hooks";

// export const ToolBar = () => {
// 	const setOptions = useSetOptions();

// 	const colors = [
// 		{
// 			name: "Red",
// 			value: "red",
// 			bg: "bg-red-600",
// 			hover: "hover:bg-red-700",
// 		},
// 		{
// 			name: "Green",
// 			value: "green",
// 			bg: "bg-green-600",
// 			hover: "hover:bg-green-700",
// 		},
// 		{
// 			name: "Black",
// 			value: "black",
// 			bg: "bg-gray-800",
// 			hover: "hover:bg-black",
// 		},
// 		{
// 			name: "Pink",
// 			value: "pink",
// 			bg: "bg-pink-500",
// 			hover: "hover:bg-pink-600",
// 		},
// 	];

// 	return (
// 		<div className="absolute left-0 top-0 z-50 flex gap-5 bg-black text-white p-2">
// 			{colors.map(({ name, value, bg, hover }) => (
// 				<button
// 					key={value}
// 					onClick={() =>
// 						setOptions((prev) => ({ ...prev, lineColor: value }))
// 					}
// 					className={`px-4 py-2 ${bg} ${hover} rounded`}
// 				>
// 					{name}
// 				</button>
// 			))}
// 		</div>
// 	);
// };
