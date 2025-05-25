"use client";
import { useCallback, useEffect, useState } from "react";
import { socket } from "@/common/lib/socket";
import { useOptions } from "@/common/recoil/options";
import usersAtom, { useUsers } from "@/common/recoil/users";
import { drawOnUndo, handleMove } from "../helpers/Canvas.helpers";
import { useBoardPosition } from "./useBoardPosition";
import { getPos } from "@/common/lib/getPos";
import { useSetRecoilState } from "recoil";

const savedMoves: Move[] = [];
let moves: [number, number][] = [];

export const useDraw = (
	// options: CtxOptions,
	ctx: CanvasRenderingContext2D | undefined,
	blocked: boolean,
	handelEnd: () => void
) => {
	const options = useOptions();
	const users = useUsers();
	const [drawing, setDrawing] = useState(false);
	const boardPosition = useBoardPosition();
	const movedX = boardPosition.x;
	const movedY = boardPosition.y;
	useEffect(() => {
		if (ctx) {
			ctx.lineJoin = "round";
			ctx.lineCap = "round";
			ctx.lineWidth = options.lineWidth;
			ctx.strokeStyle = options.lineColor;
		}
	});
	const handleUndo = useCallback(() => {
		if (ctx) {
			savedMoves.pop();
			socket.emit("undo");
			drawOnUndo(ctx, savedMoves, users);
			handelEnd();
		}
	}, [ctx, savedMoves, users, handelEnd]);

	useEffect(() => {
		const handleUndoKeyboard = (e: KeyboardEvent) => {
			if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
				handleUndo();
			}
		};

		document.addEventListener("keydown", handleUndoKeyboard);
		return () => {
			document.removeEventListener("keydown", handleUndoKeyboard);
		};
	}, [handleUndo]);

	const handleStartDrawing = (x: number, y: number) => {
		if (!ctx || blocked) return;
		setDrawing(true);
		ctx.beginPath();
		ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
		ctx.stroke();
	};

	const handleEndDrawing = () => {
		if (!ctx || blocked) return;

		setDrawing(false);
		ctx.closePath();

		const move: Move = {
			path: moves,
			options,
		};
		savedMoves.push(move);
		socket.emit("draw", move);
		moves = [];

		handelEnd();
	};

	const handleDraw = (x: number, y: number) => {
		if (!ctx || !drawing || blocked) {
			return;
		}
		ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
		ctx.stroke();
		moves.push([getPos(x, movedX), getPos(y, movedY)]);
	};
	return {
		handleEndDrawing,
		handleDraw,
		handleStartDrawing,
		handleUndo,
		drawing,
	};
};

export const useSocketDraw = (
	ctx: CanvasRenderingContext2D | undefined,
	drawing: Boolean,
	handleEnd: () => void
) => {
	const setUsers = useSetRecoilState(usersAtom);

	useEffect(() => {
		socket.emit("joined_room");
	}, []);

	useEffect(() => {
		socket.on("room", (roomJSON: string) => {
			const room: Room = new Map(JSON.parse(roomJSON));

			room.forEach((userMoves, userId) => {
				if (ctx) {
					console.log(userMoves);

					userMoves.forEach((move) => handleMove(move, ctx));
				}
				handleEnd();
				setUsers((prevUsers) => ({
					...prevUsers,
					[userId]: userMoves,
				}));
			});
		});

		return () => {
			socket.off("room");
		};
	}, [ctx, handleEnd, setUsers]);

	useEffect(() => {
		let moveToDrawLater: Move | undefined;
		let userIdLater = "";
		socket.on("user_draw", (move, userId) => {
			if (ctx && !drawing) {
				handleMove(move, ctx);
				console.log("------", userId);
				setUsers((prevUsers) => {
					const newUsers = { ...prevUsers };
					// if (!Array.isArray(newUsers[userId])) {
					// 	newUsers[userId] = [];
					// }
					// newUsers[userId] = [...newUsers[userId], newMoves]; // ✅ Correct: push stroke as an array
					if (newUsers[userId])
						newUsers[userId] = [...newUsers[userId], move];

					return newUsers;
				});
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
				handleMove(moveToDrawLater, ctx);
				handleEnd();

				setUsers((prevUsers) => {
					const newUsers = { ...prevUsers };

					newUsers[userIdLater] = [
						...newUsers[userIdLater],
						moveToDrawLater as Move,
					];

					return newUsers;
				});
			}
		};
	}, [ctx, handleEnd, setUsers, drawing]);
	useEffect(() => {
		socket.on("user_undo", (userId) => {
			setUsers((prevUsers) => {
				const newUsers = { ...prevUsers };
				newUsers[userId] = newUsers[userId].slice(0, -1);

				if (ctx) {
					drawOnUndo(ctx, savedMoves, newUsers);
					handleEnd();
				}

				return newUsers;
			});
		});
		return () => {
			socket.off("user_undo");
		};
	}, [ctx]);
};
