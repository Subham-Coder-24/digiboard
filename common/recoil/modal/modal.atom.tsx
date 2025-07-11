import { atom } from "recoil";
const uniqueId = Math.random().toString(36).substr(2, 9);

export const modalAtom = atom<{
	modal: JSX.Element | JSX.Element[];
	opened: boolean;
}>({
	key: `modal-${uniqueId}`,
	default: {
		modal: <></>,
		opened: false,
	},
});
