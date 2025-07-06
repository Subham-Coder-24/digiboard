import { useRoom } from "@/common/recoil/room";
import { useBoardPosition } from "./useBoardPosition";
import { useEffect, useState } from "react";
import { useOptionsValue } from "@/common/recoil/options";
import { socket } from "@/common/lib/socket";
import { getPos } from "@/common/lib/getPos";
import { drawCircle, drawLine, drawRect } from "../helpers/Canvas.helpers";
import { useRefs } from "./useRefs";
import { useSetSavedMoves } from "@/common/recoil/savedMoves";

let tempMoves: [number, number][] = [];

let tempCircle = { cX: 0, cY: 0, radiusX: 0, radiusY: 0 };
let tempSize = { width: 0, height: 0 };
let tempRadius = 0;
let tempImageData: ImageData | undefined;

export const useDraw = (blocked: boolean) => {
	const room = useRoom();
	const { canvasRef } = useRefs();
	const { clearSavedMoves } = useSetSavedMoves();

	const [drawing, setDrawing] = useState(false);
	const boardPosition = useBoardPosition();

	const movedX = boardPosition.x;
	const movedY = boardPosition.y;

	const options = useOptionsValue();

	const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
	useEffect(() => {
		const newCtx = canvasRef.current.getContext("2d");
		if (newCtx) setCtx(newCtx);
	}, [canvasRef]);
	function rgbaToString(color: RgbaColor): string {
		return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
	}
	const setupCtxOptions = () => {
		if (ctx) {
			ctx.lineJoin = "round";
			ctx.lineCap = "round";
			ctx.lineWidth = options.lineWidth;
			ctx.strokeStyle = rgbaToString(options.lineColor);
			if (options.erase) ctx.globalCompositeOperation = "destination-out";
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

		ctx.beginPath();
		ctx.lineTo(finalX, finalY);
		ctx.stroke();
		tempMoves.push([finalX, finalY]);
	};

	const handleEndDrawing = () => {
		if (!ctx || blocked) return;

		setDrawing(false);
		ctx.closePath();

		const move: Move = {
			rect: {
				...tempSize,
			},
			circle: {
				...tempCircle,
			},
			img: {
				base64: "",
			},
			path: tempMoves,
			options,
			timestamp: 0,
			eraser: options.erase,
			id: "",
		};

		tempMoves = [];
		tempCircle = { cX: 0, cY: 0, radiusX: 0, radiusY: 0 };
		tempSize = { width: 0, height: 0 };
		tempImageData = undefined;
		socket.emit("draw", move);
		clearSavedMoves();
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
	};
};
