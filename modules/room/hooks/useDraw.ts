import { useMyMoves } from "@/common/recoil/room";
import { useBoardPosition } from "./useBoardPosition";
import { useState } from "react";
import { useOptionsValue } from "@/common/recoil/options";
import { socket } from "@/common/lib/socket";
import { getPos } from "@/common/lib/getPos";
import { drawCircle, drawLine, drawRect } from "../helpers/Canvas.helpers";

import { useSetSavedMoves } from "@/common/recoil/savedMoves";
import { useSetSelection } from "@/common/recoil/options/options.hooks";

import { useCtx } from "./useCtx";
import { getStringFromRgba } from "@/common/lib/rgba";
import { DEFAULT_MOVE } from "@/common/constants/defaultMove";

let tempMoves: [number, number][] = [];

let tempCircle = { cX: 0, cY: 0, radiusX: 0, radiusY: 0 };
let tempSize = { width: 0, height: 0 };
let tempRadius = 0;
let tempImageData: ImageData | undefined;

export const useDraw = (blocked: boolean) => {
	const boardPosition = useBoardPosition();
	const { clearSavedMoves } = useSetSavedMoves();
	const { setSelection, clearSelection } = useSetSelection();
	const { handleAddMyMove } = useMyMoves();

	const movedX = boardPosition.x;
	const movedY = boardPosition.y;

	const options = useOptionsValue();

	const [drawing, setDrawing] = useState(false);

	const ctx = useCtx();

	const setupCtxOptions = () => {
		if (ctx) {
			ctx.lineWidth = options.lineWidth;
			ctx.strokeStyle = getStringFromRgba(options.lineColor);
			ctx.fillStyle = getStringFromRgba(options.fillColor);
			if (options.mode === "eraser")
				ctx.globalCompositeOperation = "destination-out";
			else {
				ctx.globalCompositeOperation = "source-over";
			}
		}
	};
	const drawAndSet = () => {
		if (!tempImageData)
			tempImageData = ctx?.getImageData(
				0,
				0,
				ctx.canvas.width,
				ctx.canvas.height
			);

		if (tempImageData) ctx?.putImageData(tempImageData, 0, 0);
	};
	const handleStartDrawing = (x: number, y: number) => {
		if (!ctx || blocked) return;

		const [finalX, finalY] = [getPos(x, movedX), getPos(y, movedY)];

		setDrawing(true);
		setupCtxOptions();
		drawAndSet();

		if (options.shape === "line" && options.mode !== "select") {
			ctx.beginPath();
			ctx.lineTo(finalX, finalY);
			ctx.stroke();
		}

		tempMoves.push([finalX, finalY]);
	};
	const clearOnYourMove = () => {
		drawAndSet();
		tempImageData = undefined;
	};

	const handleEndDrawing = () => {
		if (!ctx || blocked) return;

		setDrawing(false);
		ctx.closePath();
		let addMove = true;
		if (options.mode === "select" && tempMoves.length) {
			clearOnYourMove();

			const x = tempMoves[0][0];
			const y = tempMoves[0][1];

			const width = tempMoves[tempMoves.length - 1][0] - x;
			const height = tempMoves[tempMoves.length - 1][1] - y;

			if (width !== 0 && height !== 0) {
				setSelection({ x, y, width, height });
			} else {
				clearSelection();
				addMove = false;
			}
		}

		const move: Move = {
			...DEFAULT_MOVE,
			rect: {
				...tempSize,
			},
			circle: {
				...tempCircle,
			},
			path: tempMoves,
			options,
		};

		tempMoves = [];
		tempCircle = { cX: 0, cY: 0, radiusX: 0, radiusY: 0 };
		tempSize = { width: 0, height: 0 };

		if (options.mode !== "select") {
			socket.emit("draw", move);
			clearSavedMoves();
		} else if (addMove) handleAddMyMove(move);
	};

	const handleDraw = (x: number, y: number, shift?: boolean) => {
		if (!ctx || !drawing || blocked) {
			return;
		}
		const [finalX, finalY] = [getPos(x, movedX), getPos(y, movedY)];
		drawAndSet(); //fix

		if (options.mode === "select") {
			console.log("handleDraw");

			ctx.fillStyle = "rgba(0, 0, 0, 0.2)";

			drawRect(ctx, tempMoves[0], finalX, finalY, false, true);
			tempMoves.push([finalX, finalY]);

			setupCtxOptions();

			return;
		}
		switch (options.shape) {
			case "line":
				if (shift) {
					tempMoves = tempMoves.slice(0, 1);
					drawAndSet();
				}
				drawLine(ctx, tempMoves[0], finalX, finalY, shift);
				tempMoves.push([finalX, finalY]);
				break;

			case "circle":
				drawAndSet();
				tempCircle = drawCircle(ctx, tempMoves[0], finalX, finalY);
				break;

			case "rect":
				drawAndSet();
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
		drawing,
		clearOnYourMove,
	};
};
