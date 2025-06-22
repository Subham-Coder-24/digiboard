import { useMyMoves } from "@/common/recoil/room";
import { useBoardPosition } from "./useBoardPosition";
import { useCallback, useEffect, useState } from "react";
import { useOptions } from "@/common/recoil/options";
import { socket } from "@/common/lib/socket";
import { getPos } from "@/common/lib/getPos";

let tempMoves: [number, number][] = [];
export const useDraw = (
	// options: CtxOptions,
	ctx: CanvasRenderingContext2D | undefined,
	blocked: boolean
) => {
	const { handleAddMyMove, handleRemoveMyMove } = useMyMoves();
	const options = useOptions();

	const [drawing, setDrawing] = useState(false);
	const boardPosition = useBoardPosition();
	const movedX = boardPosition.x;
	const movedY = boardPosition.y;
	useEffect(() => {
		if (ctx) {
			ctx.lineJoin = "round";
			ctx.lineCap = "round";
			ctx.lineWidth = options.lineWidth;
			ctx.strokeStyle = options.lineColor;
		}
	});
	const handleUndo = useCallback(() => {
		if (ctx) {
			handleRemoveMyMove();
			socket.emit("undo");
		}
	}, [ctx, handleRemoveMyMove]);

	useEffect(() => {
		const handleUndoKeyboard = (e: KeyboardEvent) => {
			if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
				handleUndo();
			}
		};

		document.addEventListener("keydown", handleUndoKeyboard);
		return () => {
			document.removeEventListener("keydown", handleUndoKeyboard);
		};
	}, [handleUndo]);

	const handleStartDrawing = (x: number, y: number) => {
		if (!ctx || blocked) return;
		setDrawing(true);
		ctx.beginPath();
		ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
		ctx.stroke();
		tempMoves.push([getPos(x, movedX), getPos(y, movedY)]);
	};

	const handleEndDrawing = () => {
		if (!ctx || blocked) return;

		setDrawing(false);
		ctx.closePath();

		const move: Move = {
			path: tempMoves,
			options,
		};
		handleAddMyMove(move);
		tempMoves = [];
		socket.emit("draw", move);
	};

	const handleDraw = (x: number, y: number) => {
		if (!ctx || !drawing || blocked) {
			return;
		}
		ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
		ctx.stroke();
		tempMoves.push([getPos(x, movedX), getPos(y, movedY)]);
	};
	return {
		handleEndDrawing,
		handleDraw,
		handleStartDrawing,
		handleUndo,
		drawing,
	};
};
