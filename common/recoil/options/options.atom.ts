"use client";
import { atom } from "recoil";
const uniqueId = Math.random().toString(36).substr(2, 9);

export const optionsAtom = atom<CtxOptions>({
	key: `options-${uniqueId}`,
	default: {
		lineColor: { r: 0, g: 0, b: 0, a: 1 },
		fillColor: { r: 0, g: 0, b: 0, a: 0 },
		lineWidth: 5,
		mode: "draw",
		shape: "line",
		selection: null,
	},
});
