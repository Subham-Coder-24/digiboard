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

	if (move.eraser) ctx.globalCompositeOperation = "destination-out";
	tempCtx.beginPath();
	path.forEach(([x, y]) => {
		tempCtx.lineTo(x, y);
	});
	tempCtx.stroke();
	tempCtx.closePath();
	ctx.globalCompositeOperation = "source-over";
};
export const drawAllMoves = (
	ctx: CanvasRenderingContext2D,
	room: ClientRoom
) => {
	const { usersMoves, movesWithoutUser, myMoves } = room;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	const moves = [...movesWithoutUser, ...myMoves];

	// Redraw user moves
	usersMoves.forEach((usersMoves) => {
		moves.push(...usersMoves);
	});

	moves.sort((a, b) => a.timestamp - b.timestamp);

	// Redraw saved moves
	moves.forEach((move) => {
		handleMove(move, ctx);
	});
};
