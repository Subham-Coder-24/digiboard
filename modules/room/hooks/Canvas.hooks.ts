"use client";
import { useCallback, useEffect, useState } from "react";
import { socket } from "@/common/lib/socket";
import { useOptions } from "@/common/recoil/options";
import usersAtom, { useUsers } from "@/common/recoil/users";
import { drawOnUndo } from "../helpers/Canvas.helpers";
import { useBoardPosition } from "./useBoardPosition";
import { getPos } from "@/common/lib/getPos";
import { useSetRecoilState } from "recoil";
let moves: [number, number][] = [];
const savedMoves: [number, number][][] = [];

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
		savedMoves.push(moves);
		socket.emit("draw", moves, options);
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
	handleEnd: () => void
) => {
	const setUsers = useSetRecoilState(usersAtom);

	useEffect(() => {
		socket.on("user_draw", (newMoves, options, userId) => {
			if (ctx) {
				console.log("------", userId);

				ctx.lineWidth = options.lineWidth;
				ctx.strokeStyle = options.lineColor;
				ctx.beginPath();

				newMoves.forEach(([x, y], index) => {
					if (index === 0) {
						ctx.moveTo(x, y); // Start from the first point
					} else {
						ctx.lineTo(x, y); // Draw to subsequent points
					}
				});

				ctx.stroke();
				ctx.closePath();

				handleEnd();

				setUsers((prevUsers) => {
					const newUsers = { ...prevUsers };

					if (!Array.isArray(newUsers[userId])) {
						newUsers[userId] = [];
					}

					newUsers[userId] = [...newUsers[userId], newMoves]; // ✅ Correct: push stroke as an array
					return newUsers;
				});
			}
		});

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

		// Cleanup
		return () => {
			socket.off("user_draw");
			socket.off("user_undo");
		};
	}, [ctx, handleEnd, setUsers]);
};
