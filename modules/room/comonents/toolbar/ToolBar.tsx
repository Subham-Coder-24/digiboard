import { BsFillChatFill, BsFillImageFill, BsThreeDots } from "react-icons/bs";
import { HiOutlineDownload } from "react-icons/hi";
import ColorPicker from "./ColorPicker";
import LineWidthPicker from "./LineWidthPicker";
import Eraser from "./Eraser";
import { RefObject } from "react";
import { FaUndo } from "react-icons/fa";
import ShapeSelector from "./ShapeSelector";

const ToolBar = ({ undoRef }: { undoRef: RefObject<HTMLButtonElement> }) => {
	return (
		<div
			style={{ transform: "translateY(-50%)" }}
			className="absolute left-10 top-[50%] z-50 flex flex-col items-center gap-5 rounded-lg bg-zinc-900 p-5 text-white"
		>
			<button className="test-xl" ref={undoRef}>
				<FaUndo />
			</button>
			<div className="h-px w-full bg-white" />
			<ColorPicker />
			<ShapeSelector />
			<LineWidthPicker />
			<Eraser />
			<button className="text-xl">
				<BsFillImageFill />
			</button>
			<button className="text-xl">
				<BsThreeDots />
			</button>
			<button className="text-xl">
				<HiOutlineDownload />
			</button>
		</div>
	);
};

export default ToolBar;
