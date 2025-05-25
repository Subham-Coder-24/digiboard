import { createServer } from "http";
import express from "express";
import next from "next";
import { Server } from "socket.io";

import {} from "@/common/types/global";
import { socket } from "@/common/lib/socket";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
	const app = express();
	const server = createServer(app);
	const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);

	app.get("/health", async (_, res) => {
		res.send("Healthy");
	});

	const rooms = new Map<string, Room>();
	rooms.set("global", new Map());

	const addMove = (roomId: string, socketId: string, move: Move) => {
		const room = rooms.get(roomId);

		if (!room) return; //check

		if (!room.has(socketId)) {
			room.set(socketId, [move]);
		}
		room.get(socketId)?.push(move);
	};

	const undoMove = (roomId: string, socketId: string) => {
		const room = rooms.get(roomId);
		room?.get(socketId)?.pop();
	};

	io.on("connection", (socket) => {
		console.log(` User connected: ${socket.id}`);

		socket.join("global");
		rooms.get("global")?.set(socket.id, []);
		setTimeout(() => {
			io.to(socket.id).emit(
				"joined",
				JSON.stringify([...rooms.get("global")!])
			);
		}, 1000);

		const allUser = io.sockets.adapter.rooms.get("global");
		if (allUser) io.to("global").emit("users_in_room", [...allUser]);

		socket.on("draw", (move) => {
			console.log("drawing", socket.id);
			addMove("global", socket.id, move);
			socket.broadcast.emit("user_draw", move, socket.id);
		});
		socket.on("undo", () => {
			console.log("undo");
			undoMove("global", socket.id);
			socket.broadcast.emit("user_undo", socket.id);
		});

		socket.on("mouse_move", (x, y) => {
			// console.log("mouse_move");
			socket.broadcast.emit("mouse_moved", x, y, socket.id);
		});
		socket.on("disconnect", () => {
			console.log(`User disconnected: ${socket.id}`);

			const globalRoom = rooms.get("global");
			if (globalRoom) {
				const wasDeleted = globalRoom.delete(socket.id);
			}

			// Notify remaining users about updated user count
			const allUsers = io.sockets.adapter.rooms.get("global");
			if (allUsers) {
				io.to("global").emit("users_in_room", [...allUsers]);
			}
		});
	});

	app.all("*", (req: any, res: any) => nextHandler(req, res));

	server.listen(port, () => {
		// eslint-disable-next-line no-console
		console.log(`> Ready on http://localhost:${port}`);
	});
});
