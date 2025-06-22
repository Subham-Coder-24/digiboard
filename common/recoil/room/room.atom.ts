import { atom } from "recoil";
const uniqueId = Math.random().toString(36).substr(2, 9);

export const DEFAULT_ROOM = {
	id: "",
	users: new Map(),
	// usersMoves: new Map(),
	movesWithoutUser: [],
	myMoves: [],
};

export const roomAtom = atom<ClientRoom>({
	key: `room-${uniqueId}`,
	default: DEFAULT_ROOM,
});
