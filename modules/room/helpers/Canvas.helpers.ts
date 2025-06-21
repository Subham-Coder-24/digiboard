export const handleMove = (
	// changed rename drawFromSocket
	move: Move,
	ctx: CanvasRenderingContext2D
) => {
	const { path, options } = move;
	const tempCtx = ctx;
	if (!tempCtx) return;

	tempCtx.lineWidth = options.lineWidth;
	tempCtx.strokeStyle = options.lineColor;

	tempCtx.beginPath();
	path.forEach(([x, y]) => {
		tempCtx.lineTo(x, y);
	});
	tempCtx.stroke();
	tempCtx.closePath();
};
export const drawAllMoves = (
	ctx: CanvasRenderingContext2D,
	movesWithoutUser: Move[],
	savedMoves: Move[],
	users: { [key: string]: Move[] }
) => {
	// Clear the entire canvas
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	movesWithoutUser.forEach((move) => {
		handleMove(move, ctx);
	});
	// Redraw user moves
	Object.values(users).forEach((user) => {
		user.forEach((move) => handleMove(move, ctx));
	});

	// Redraw saved moves
	savedMoves.forEach((move) => {
		handleMove(move, ctx);
	});
};
