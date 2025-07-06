import { BsFillImageFill, BsThreeDots } from "react-icons/bs";
import { HiOutlineDownload } from "react-icons/hi";
import ColorPicker from "./ColorPicker";
import LineWidthPicker from "./LineWidthPicker";
import Eraser from "./Eraser";

import ShapeSelector from "./ShapeSelector";
import { useRefs } from "../../hooks/useRefs";
import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import ImagePicker from "./ImagePicker";
import HistoryBtns from "./HistoryBtns";

const ToolBar = () => {
	const { canvasRef, bgRef } = useRefs();
	const handleDownload = () => {
		const canvas = document.createElement("canvas");
		canvas.width = CANVAS_SIZE.width;
		canvas.height = CANVAS_SIZE.height;

		const tempCtx = canvas.getContext("2d");

		if (tempCtx && canvasRef.current && bgRef.current) {
			tempCtx.drawImage(bgRef.current, 0, 0);
			tempCtx.drawImage(canvasRef.current, 0, 0);
		}

		const link = document.createElement("a");
		link.href = canvas.toDataURL("image/png");
		link.download = "canvas.png";
		link.click();
	};
	return (
		<div
			style={{ transform: "translateY(-50%)" }}
			className="absolute left-10 top-[50%] z-50 flex flex-col items-center gap-5 rounded-lg bg-zinc-900 p-5 text-white"
		>
			<HistoryBtns />
			<div className="h-px w-full bg-white" />
			<ColorPicker />
			<ShapeSelector />
			<LineWidthPicker />
			<ImagePicker />
			<Eraser />
			<button className="text-xl">
				<BsFillImageFill />
			</button>
			<button className="text-xl">
				<BsThreeDots />
			</button>
			<button className="text-xl" onClick={handleDownload}>
				<HiOutlineDownload />
			</button>
		</div>
	);
};

export default ToolBar;
