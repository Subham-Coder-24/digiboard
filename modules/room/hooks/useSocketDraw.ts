"use client";
import { useEffect } from "react";
import { socket } from "@/common/lib/socket";
import { handleMove } from "../helpers/Canvas.helpers";

import { useSetUsers } from "@/common/recoil/room";

const movesWithoutUser: Move[] = [];
const savedMoves: Move[] = [];
let tempMoves: [number, number][] = [];

export const useSocketDraw = (
	ctx: CanvasRenderingContext2D | undefined,
	drawing: Boolean
) => {
	const { handleAddMoveToUser, handleRemoveMoveFromUser } = useSetUsers();
	console.log("draw form scoker");

	useEffect(() => {
		let moveToDrawLater: Move | undefined;
		let userIdLater = "";
		socket.on("user_draw", (move, userId) => {
			if (ctx && !drawing) {
				handleAddMoveToUser(userId, move);
			} else {
				moveToDrawLater = move;
				userIdLater = userId;
			}
		});

		// Cleanup
		return () => {
			// Cleanup socket events
			socket.off("user_draw");

			if (moveToDrawLater && userIdLater && ctx) {
				handleAddMoveToUser(userIdLater, moveToDrawLater);
			}
		};
	}, [ctx, drawing, handleAddMoveToUser]);
	useEffect(() => {
		socket.on("user_undo", (userId) => {
			handleRemoveMoveFromUser(userId);
		});
		return () => {
			socket.off("user_undo");
		};
	}, [ctx, handleRemoveMoveFromUser]);
};

// import { useEffect } from "react";

// import { socket } from "@/common/lib/socket";
// import { useSetUsers } from "@/common/recoil/room";

// export const useSocketDraw = (drawing: boolean) => {
// 	const { handleAddMoveToUser, handleRemoveMoveFromUser } = useSetUsers();

// 	useEffect(() => {
// 		let moveToDrawLater: Move | undefined;
// 		let userIdLater = "";

// 		socket.on("user_draw", (move, userId) => {
// 			if (!drawing) {
// 				handleAddMoveToUser(userId, move);
// 			} else {
// 				moveToDrawLater = move;
// 				userIdLater = userId;
// 			}
// 		});

// 		return () => {
// 			socket.off("user_draw");

// 			if (moveToDrawLater && userIdLater) {
// 				handleAddMoveToUser(userIdLater, moveToDrawLater);
// 			}
// 		};
// 	}, [drawing, handleAddMoveToUser]);

// 	useEffect(() => {
// 		socket.on("user_undo", (userId) => {
// 			handleRemoveMoveFromUser(userId);
// 		});

// 		return () => {
// 			socket.off("user_undo");
// 		};
// 	}, [handleRemoveMoveFromUser]);
// };
