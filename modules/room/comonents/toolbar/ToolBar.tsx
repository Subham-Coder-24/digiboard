import { HiOutlineDownload } from "react-icons/hi";
import ColorPicker from "./ColorPicker";
import LineWidthPicker from "./LineWidthPicker";
import { ImExit } from "react-icons/im";
import ShapeSelector from "./ShapeSelector";
import { useRefs } from "../../hooks/useRefs";
import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import ImagePicker from "./ImagePicker";
import HistoryBtns from "./HistoryBtns";
import ModePicker from "./ModePicker";
import { useRouter } from "next/router";
import { IoIosShareAlt } from "react-icons/io";
import ShareModal from "../../modals/ShareModal";
import { useModal } from "@/common/recoil/modal";
import BackgroundPicker from "./BackgoundPicker";

const ToolBar = () => {
	const router = useRouter();
	const handleExit = () => router.push("/");
	const { canvasRef, bgRef } = useRefs();
	const { openModal } = useModal();
	const handleShare = () => openModal(<ShareModal />);

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
			<ModePicker />
			<ImagePicker />
			<div className="h-px w-full bg-white" />
			<BackgroundPicker />
			<button className="btn-icon text-2xl" onClick={handleShare}>
				<IoIosShareAlt />
			</button>
			<button className="text-xl" onClick={handleDownload}>
				<HiOutlineDownload />
			</button>
			<button className="btn-icon text-xl" onClick={handleExit}>
				<ImExit />
			</button>
		</div>
	);
};

export default ToolBar;
