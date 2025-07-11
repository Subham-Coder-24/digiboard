"use client";

import { useEffect, useState } from "react";

import { motion, useMotionValue } from "framer-motion";

import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import { useViewportSize } from "@/common/hooks/useViewportSize";
import { socket } from "@/common/lib/socket";

import { useKeyPressEvent } from "react-use";
import { useRoom } from "@/common/recoil/room";

import MiniMap from "./Minimap";
import { useBoardPosition } from "../../hooks/useBoardPosition";
import { useSocketDraw } from "../../hooks/useSocketDraw";
import { useDraw } from "../../hooks/useDraw";
import Background from "./Background";
import { useRefs } from "../../hooks/useRefs";
import { useMovesHandlers } from "../../hooks/useMovesHandlers";
import { useCtx } from "../../hooks/useCtx";
import { BsArrowsMove } from "react-icons/bs";

const Canvas = () => {
	const { canvasRef, bgRef, undoRef, redoRef } = useRefs();
	const [dragging, setDragging] = useState(true);
	const { width, height } = useViewportSize();
	const { x, y } = useBoardPosition();
	const ctx = useCtx();
	const {
		handleDraw,
		handleEndDrawing,
		handleStartDrawing,
		drawing,
		clearOnYourMove,
	} = useDraw(dragging);
	useSocketDraw(drawing);
	const { handleUndo, handleRedo } = useMovesHandlers(clearOnYourMove);
	useEffect(() => {
		setDragging(false);
	}, []);
	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			setDragging(e.ctrlKey);
		};

		window.addEventListener("keyup", handleKey);
		window.addEventListener("keydown", handleKey);
		const undoBtn = undoRef.current;
		const redoBtn = redoRef.current;
		undoBtn?.addEventListener("click", handleUndo);
		redoBtn?.addEventListener("click", handleRedo);
		return () => {
			window.removeEventListener("keyup", handleKey);
			window.removeEventListener("keydown", handleKey);
			undoBtn?.removeEventListener("click", handleUndo);
			redoBtn?.removeEventListener("click", handleRedo);
		};
	}, [dragging, handleUndo, handleRedo, undoRef, redoRef, canvasRef]);

	useEffect(() => {
		if (ctx) socket.emit("joined_room");
	}, [ctx]);
	return (
		<div className="relative h-full w-full overflow-hidden">
			{/* <button className="absolute top-0 z-40" onClick={handleUndo}>
				Undo
			</button> */}
			<motion.canvas
				// SETTINGS
				ref={canvasRef}
				width={CANVAS_SIZE.width}
				height={CANVAS_SIZE.height}
				className={`absolute top-0 z-10 ${dragging && "cursor-move"}`}
				style={{ x, y }}
				// DRAG
				drag={dragging}
				dragConstraints={{
					left: -(CANVAS_SIZE.width - width),
					right: 0,
					top: -(CANVAS_SIZE.height - height),
					bottom: 0,
				}}
				dragElastic={0}
				dragTransition={{ power: 0, timeConstant: 0 }}
				// HANDLERS
				onMouseDown={(e) => handleStartDrawing(e.clientX, e.clientY)}
				onMouseUp={handleEndDrawing}
				onMouseMove={(e) => {
					handleDraw(e.clientX, e.clientY, e.shiftKey);
				}}
				onTouchStart={(e) =>
					handleStartDrawing(
						e.changedTouches[0].clientX,
						e.changedTouches[0].clientY
					)
				}
				onTouchEnd={handleEndDrawing}
				onTouchMove={(e) =>
					handleDraw(
						e.changedTouches[0].clientX,
						e.changedTouches[0].clientY
					)
				}
			/>
			<Background bgRef={bgRef} />
			<MiniMap dragging={dragging} />
			<button
				className={`absolute bottom-14 right-5 z-10 rounded-xl md:bottom-5 ${
					dragging ? "bg-green-500" : "bg-zinc-300 text-black"
				} p-3 text-lg text-white`}
				onClick={() => setDragging((prev) => !prev)}
			>
				<BsArrowsMove />
			</button>
		</div>
	);
};
export default Canvas;
