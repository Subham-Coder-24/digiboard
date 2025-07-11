import { AiOutlineDelete } from "react-icons/ai";
import { BsArrowsMove } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";

import { useOptionsValue } from "@/common/recoil/options";

import { useRefs } from "../../hooks/useRefs";
import { useBoardPosition } from "../../hooks/useBoardPosition";

const SelectionBtns = () => {
	const { selection } = useOptionsValue();
	const { selectionRefs } = useRefs();
	const { x, y } = useBoardPosition();
	let top;
	let left;

	const { x: boardX, y: boardY } = useBoardPosition(); // MotionValues

	if (selection) {
		const { x, y, width, height } = selection;
		top = Math.min(y, y + height) + boardY.get() - 40;
		left = Math.min(x, x + width) + boardX.get();
	} else {
		top = -40;
		left = -40;
	}

	return (
		<div
			className="absolute top-0 left-0 z-50 flex items-center justify-center gap-2"
			style={{ top, left }}
		>
			<button
				className="rounded-full bg-gray-200 p-2"
				ref={(ref) => {
					if (ref && selectionRefs.current)
						selectionRefs.current[0] = ref;
				}}
			>
				<BsArrowsMove />
			</button>
			<button
				className="rounded-full bg-gray-200 p-2"
				ref={(ref) => {
					if (ref && selectionRefs.current)
						selectionRefs.current[1] = ref;
				}}
			>
				<FiCopy />
			</button>
			<button
				className="rounded-full bg-gray-200 p-2"
				ref={(ref) => {
					if (ref && selectionRefs.current)
						selectionRefs.current[2] = ref;
				}}
			>
				<AiOutlineDelete />
			</button>
		</div>
	);
};

export default SelectionBtns;
