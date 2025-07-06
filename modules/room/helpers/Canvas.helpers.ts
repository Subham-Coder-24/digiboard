import { getStringFromRgba } from "@/common/lib/rgba";
type RgbaColor = {
	r: number;
	g: number;
	b: number;
	a: number;
};
function rgbaToString(color: RgbaColor): string {
	return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}

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
	y: number
): number => {
	ctx.beginPath();
	const radius = Math.sqrt((x - from[0]) ** 2 + (y - from[1]) ** 2);
	ctx.arc(from[0], from[1], radius, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.closePath();
	return radius;
};

export const drawRect = (
	ctx: CanvasRenderingContext2D,
	from: [number, number],
	x: number,
	y: number,
	shift?: boolean
) => {
	ctx.beginPath();

	let width = 0;
	let height = 0;

	if (shift) {
		const d = Math.sqrt((x - from[0]) ** 2 + (y - from[1]) ** 2);
		width = d / Math.sqrt(2);
		height = d / Math.sqrt(2);

		if (x - from[0] > 0 && y - from[1] < 0) {
			height = -height;
		} else if (y - from[1] > 0 && x - from[0] < 0) {
			width = -width;
		} else if (x - from[0] < 0 && y - from[1] < 0) {
			width = -width;
			height = -height;
		}
	} else {
		width = x - from[0];
		height = y - from[1];
	}

	ctx.rect(from[0], from[1], width, height);
	ctx.stroke();
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
