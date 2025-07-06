const getWidthAndHeight = (
	x: number,
	y: number,
	from: [number, number],
	shift?: boolean
) => {
	let width = x - from[0];
	let height = y - from[1];

	if (shift) {
		if (Math.abs(width) > Math.abs(height)) {
			if ((width > 0 && height < 0) || (width < 0 && height > 0))
				width = -height;
			else width = height;
		} else if ((height > 0 && width < 0) || (height < 0 && width > 0))
			height = -width;
		else height = width;
	} else {
		width = x - from[0];
		height = y - from[1];
	}

	return { width, height };
};

export const drawCircle = (
	ctx: CanvasRenderingContext2D,
	from: [number, number],
	x: number,
	y: number,
	shift?: boolean
) => {
	ctx.beginPath();

	const cX = (x + from[0]) / 2;
	const cY = (y + from[1]) / 2;

	let radiusX = 0;
	let radiusY = 0;

	if (shift) {
		const d = Math.sqrt((x - from[0]) ** 2 + (y - from[1]) ** 2);
		radiusX = d / Math.sqrt(2) / 2;
		radiusY = d / Math.sqrt(2) / 2;
	} else {
		radiusX = Math.abs(cX - from[0]);
		radiusY = Math.abs(cY - from[1]);
	}

	ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.closePath();

	return { cX, cY, radiusX, radiusY };
};

export const drawRect = (
	ctx: CanvasRenderingContext2D,
	from: [number, number],
	x: number,
	y: number,
	shift?: boolean,
	fill?: boolean
) => {
	ctx.beginPath();

	const { width, height } = getWidthAndHeight(x, y, from, shift);

	if (fill) ctx.fillRect(from[0], from[1], width, height);
	else ctx.rect(from[0], from[1], width, height);

	ctx.stroke();
	ctx.fill();
	ctx.closePath();

	return { width, height };
};

export const drawLine = (
	ctx: CanvasRenderingContext2D,
	from: [number, number],
	x: number,
	y: number,
	shift?: boolean
) => {
	if (shift) {
		ctx.beginPath();
		ctx.lineTo(from[0], from[1]);
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.closePath();

		return;
	}

	ctx.lineTo(x, y);
	ctx.stroke();
};
