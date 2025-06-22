import { useMyMoves, useRoom } from "@/common/recoil/room";
import { useBoardPosition } from "./useBoardPosition";
import { useCallback, useEffect, useState } from "react";
import { useOptionsValue } from "@/common/recoil/options";
import { socket } from "@/common/lib/socket";
import { getPos } from "@/common/lib/getPos";
import { getStringFromRgba } from "@/common/lib/rgba";
import {
	drawAllMoves,
	drawCircle,
	drawLine,
	drawRect,
	handleMove,
} from "../helpers/Canvas.helpers";

let tempMoves: [number, number][] = [];

let tempCircle = { cX: 0, cY: 0, radiusX: 0, radiusY: 0 };
let tempSize = { width: 0, height: 0 };
let tempRadius = 0;

const setupCtxOptions = (
	ctx: CanvasRenderingContext2D,
	options: CtxOptions
) => {
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.lineWidth = options.lineWidth;
	ctx.strokeStyle = getStringFromRgba(options.lineColor);
	if (options.erase) ctx.globalCompositeOperation = "destination-out";
};
export const useDraw = (
	// options: CtxOptions,
	ctx: CanvasRenderingContext2D | undefined,
	blocked: boolean
) => {
	const { handleAddMyMove, handleRemoveMyMove } = useMyMoves();
	const options = useOptionsValue();
	const room = useRoom();

	const [drawing, setDrawing] = useState(false);
	const boardPosition = useBoardPosition();
	const movedX = boardPosition.x;
	const movedY = boardPosition.y;
	useEffect(() => {
		if (ctx) {
			setupCtxOptions(ctx, options);
		}
	});
	useEffect(() => {
		socket.on("your_move", (move) => {
			handleAddMyMove(move);
		});
		return () => {
			socket.off("your_move");
		};
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
		const [finalX, finalY] = [getPos(x, movedX), getPos(y, movedY)];

		setDrawing(true);
		ctx.beginPath();
		ctx.lineTo(finalX, finalY);
		ctx.stroke();
		tempMoves.push([finalX, finalY]);
	};

	const handleEndDrawing = () => {
		if (!ctx || blocked) return;

		setDrawing(false);
		ctx.closePath();

		if (options.shape !== "circle") {
			tempRadius = 0;
		}

		if (options.shape !== "rect") {
			tempSize = { width: 0, height: 0 };
		}

		const move: Move = {
			...tempSize,
			shape: options.shape,
			radius: tempRadius,
			path: tempMoves,
			options,
			timestamp: 0,
			eraser: options.erase,
		};

		tempMoves = [];
		ctx.globalCompositeOperation = "source-over";
		socket.emit("draw", move);
	};

	const handleDraw = (x: number, y: number, shift?: boolean) => {
		if (!ctx || !drawing || blocked) {
			return;
		}
		const [finalX, finalY] = [getPos(x, movedX), getPos(y, movedY)];

		switch (options.shape) {
			case "line":
				if (shift) {
					tempMoves = tempMoves.slice(0, 1);
					drawAllMoves(ctx, room, options);
				}
				drawLine(ctx, tempMoves[0], finalX, finalY, shift);
				tempMoves.push([finalX, finalY]);
				break;

			case "circle":
				drawAllMoves(ctx, room, options);
				tempRadius = drawCircle(ctx, tempMoves[0], finalX, finalY);
				break;

			case "rect":
				drawAllMoves(ctx, room, options);
				tempSize = drawRect(ctx, tempMoves[0], finalX, finalY, shift);
				break;

			default:
				break;
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
