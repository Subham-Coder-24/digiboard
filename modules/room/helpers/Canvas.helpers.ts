import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import { getStringFromRgba } from "@/common/lib/rgba";

export const handleMove = (
	// changed rename drawFromSocket
	move: Move,
	ctx: CanvasRenderingContext2D
) => {
	const { path, options } = move;
	const tempCtx = ctx;
	if (!tempCtx) return;

	tempCtx.lineWidth = options.lineWidth;
	tempCtx.strokeStyle = getStringFromRgba(options.lineColor);

	tempCtx.beginPath();
	path.forEach(([x, y]) => {
		tempCtx.lineTo(x, y);
	});
	tempCtx.stroke();
	tempCtx.closePath();
};
export const drawBackground = (ctx: CanvasRenderingContext2D) => {
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#ccc";

	for (let i = 0; i < CANVAS_SIZE.height; i += 25) {
		ctx.beginPath();
		ctx.moveTo(0, i);
		ctx.lineTo(ctx.canvas.width, i);
		ctx.stroke();
	}

	for (let i = 0; i < CANVAS_SIZE.width; i += 25) {
		ctx.beginPath();
		ctx.moveTo(i, 0);
		ctx.lineTo(i, ctx.canvas.height);
		ctx.stroke();
	}
};
export const drawAllMoves = (
	ctx: CanvasRenderingContext2D,
	room: ClientRoom
) => {
	const { usersMoves, movesWithoutUser, myMoves } = room;
	// Clear the entire canvas
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	drawBackground(ctx);
	movesWithoutUser.forEach((move) => {
		handleMove(move, ctx);
	});
	// Redraw user moves
	usersMoves.forEach((usersMoves) => {
		usersMoves.forEach((move) => handleMove(move, ctx));
	});

	// Redraw saved moves
	myMoves.forEach((move) => {
		handleMove(move, ctx);
	});
};
