"use client";
import { atom } from "recoil";
const uniqueId = Math.random().toString(36).substr(2, 9);

export const optionsAtom = atom<CtxOptions>({
	key: `options-${uniqueId}`,
	default: {
		lineColor: "#000000",
		lineWidth: 5,
	},
});
