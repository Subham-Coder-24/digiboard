import { useEffect, useMemo } from "react";

import { toast } from "react-toastify";

import { DEFAULT_MOVE } from "@/common/constants/defaultMove";
import { socket } from "@/common/lib/socket";
import { useOptionsValue } from "@/common/recoil/options";

import { useCtx } from "./useCtx";
import { useMoveImage } from "./useMoveImage";
import { useRefs } from "./useRefs";

let tempSelection = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
};

export const useSelection = (drawAllMoves: () => Promise<void>) => {
	const ctx = useCtx();
	const options = useOptionsValue();
	const { selection } = options;
	const { bgRef } = useRefs();
	const { setMoveImage } = useMoveImage();

	useEffect(() => {
		const callback = async () => {
			if (ctx && selection) {
				await drawAllMoves();

				setTimeout(() => {
					const { x, y, width, height } = selection;

					ctx.lineWidth = 2;
					ctx.strokeStyle = "#000";
					ctx.setLineDash([5, 10]);
					ctx.globalCompositeOperation = "source-over";

					ctx.beginPath();
					ctx.rect(x, y, width, height);
					ctx.stroke();
					ctx.closePath();

					ctx.setLineDash([]);
				}, 10);
			}
		};

		// if (
		// 	tempSelection.width !== selection?.width ||
		// 	tempSelection.height !== selection?.height ||
		// 	tempSelection.x !== selection?.x ||
		// 	tempSelection.y !== selection?.y
		// )
		callback();

		// return () => {
		// 	if (selection) tempSelection = selection;
		// };

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selection, ctx]);

	useEffect(() => {
		const handleCopySelection = async (e: KeyboardEvent) => {
			if (!selection) return null;
			const { x, y, width, height } = selection;

			if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
				const imageData = ctx?.getImageData(x, y, width, height);

				if (imageData) {
					const canvas = document.createElement("canvas");
					canvas.width = width;
					canvas.height = height;

					const tempCtx = canvas.getContext("2d");
					tempCtx?.putImageData(imageData, 0, 0);

					canvas.toBlob(async (blob) => {
						if (blob) {
							const item = new ClipboardItem({
								"image/png": blob,
							});
							await navigator.clipboard.write([item]);
							console.log("Image copied to clipboard!");
						}
					}, "image/png");
				}
			}
			if ((e.key === "Delete" || e.key === "Backspace") && selection) {
				console.log("deleted");

				const move: Move = {
					circle: {
						cX: 0,
						cY: 0,
						radiusX: 0,
						radiusY: 0,
					},
					rect: {
						fill: true,
						width,
						height,
					},
					path: [[x, y]],
					options: {
						...options,
						shape: "rect",
						mode: "eraser",
					},
					id: "",
					img: {
						base64: "",
					},
					timestamp: 0,
				};
				socket.emit("draw", move);
			}
		};

		document.addEventListener("keydown", handleCopySelection);
		return () => {
			document.removeEventListener("keydown", handleCopySelection);
		};
	}, [selection, ctx, bgRef, options]);
};
