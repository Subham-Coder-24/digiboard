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

const Canvas = () => {
	const ctx = useCtx();
	// const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
	const [dragging, setDragging] = useState(false);
	const [, setMovedMiniMap] = useState(false);
	const { width, height } = useViewportSize();
	const { handleUndo, handleRedo } = useMovesHandlers();
	const room = useRoom();

	const { canvasRef, bgRef, undoRef, redoRef } = useRefs();

	useKeyPressEvent("Control", (e) => {
		if (e?.ctrlKey && !dragging) {
			setDragging(true);
		}
	});

	const { x, y } = useBoardPosition();

	const { handleDraw, handleEndDrawing, handleStartDrawing, drawing } =
		useDraw(dragging);

	useEffect(() => {
		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.ctrlKey && dragging) {
				setDragging(false);
			}
		};

		window.addEventListener("keyup", handleKeyUp);
		const undoBtn = undoRef.current;
		const redoBtn = redoRef.current;
		undoBtn?.addEventListener("click", handleUndo);
		redoBtn?.addEventListener("click", handleRedo);
		return () => {
			window.removeEventListener("keyup", handleKeyUp);
			undoBtn?.removeEventListener("click", handleUndo);
			redoBtn?.removeEventListener("click", handleRedo);
		};
	}, [dragging, handleUndo, handleRedo, undoRef, redoRef, canvasRef]);

	useSocketDraw(drawing);
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
			<MiniMap
				dragging={dragging}
				setMovedMinimap={setMovedMiniMap} // Fixed syntax
			/>
		</div>
	);
};
export default Canvas;
