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
export const drawAllMoves = (
	ctx: CanvasRenderingContext2D,
	room: ClientRoom
) => {
	const { users, movesWithoutUser, myMoves } = room;
	// Clear the entire canvas
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	movesWithoutUser.forEach((move) => {
		handleMove(move, ctx);
	});
	// Redraw user moves
	users.forEach((usersMoves) => {
		usersMoves.forEach((move) => handleMove(move, ctx));
	});

	// Redraw saved moves
	myMoves.forEach((move) => {
		handleMove(move, ctx);
	});
};
