export const drawFromSocket = (
	socketMoves: [number, number][],
	socketOptions: CtxOptions,
	ctx: CanvasRenderingContext2D,
	afterDraw: () => void
) => {
	const tempCtx = ctx;
	if (!tempCtx) return;

	tempCtx.lineWidth = socketOptions.lineWidth;
	tempCtx.strokeStyle = socketOptions.lineColor;

	tempCtx.beginPath();
	socketMoves.forEach(([x, y]) => {
		tempCtx.lineTo(x, y);
	});
	tempCtx.stroke();
	tempCtx.closePath();
	afterDraw();
};
export const drawOnUndo = (
	ctx: CanvasRenderingContext2D,
	savedMoves: [number, number][][],
	users: { [key: string]: [number, number][][] }
) => {
	// Clear the entire canvas
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	// Redraw user moves
	Object.values(users).forEach((userMoves) => {
		userMoves.forEach((movePath) => {
			ctx.beginPath();
			movePath.forEach(([x, y], index) => {
				if (index === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			});
			ctx.stroke();
			ctx.closePath();
		});
	});

	// Redraw saved moves
	savedMoves.forEach((movePath) => {
		ctx.beginPath();
		movePath.forEach(([x, y], index) => {
			if (index === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		});
		ctx.stroke();
		ctx.closePath();
	});
};
