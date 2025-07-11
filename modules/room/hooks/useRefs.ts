import { useContext } from "react";

import { roomContext } from "../context/Room.context";

export const useRefs = () => {
	const { undoRef, redoRef, bgRef, canvasRef, minimapRef, selectionRefs } =
		useContext(roomContext);

	return {
		undoRef,
		redoRef,
		bgRef,
		canvasRef,
		minimapRef,
		selectionRefs,
	};
};
