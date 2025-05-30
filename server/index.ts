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
		const getRoomId = () => {
			const joinedRoom = [...socket.rooms].find(
				(room) => room !== socket.id
			);

			if (!joinedRoom) return socket.id;

			return joinedRoom;
		};

		socket.on("create_room", () => {
			let roomId: string;
			do {
				roomId = Math.random().toString(36).substring(2, 6);
			} while (rooms.has(roomId));

			socket.join(roomId);

			rooms.set(roomId, new Map());

			rooms.get(roomId)?.set(socket.id, []);

			io.to(socket.id).emit("created", roomId);
		});
		socket.on("join_room", (roomId) => {
			if (rooms.has(roomId)) {
				socket.join(roomId);

				io.to(socket.id).emit("joined", roomId);
			} else io.to(socket.id).emit("joined", "", true);
		});
		socket.on("joined_room", () => {
			const roomId = getRoomId();
			console.log("joined_room", roomId);
			rooms.get(roomId)?.set(socket.id, []);
			io.to(socket.id).emit(
				"room",
				JSON.stringify([...rooms.get(roomId)!])
			);
			socket.broadcast.to(roomId).emit("new_user", socket.id);
		});

		socket.on("leave_room", () => {
			const roomId = getRoomId();
			const user = rooms.get(roomId)?.get(socket.id);
			if (user?.length == 0) rooms.get(roomId)?.delete(socket.id);
		});

		// const allUser = io.sockets.adapter.rooms.get("global");
		// if (allUser) io.to("global").emit("users_in_room", [...allUser]);

		socket.on("draw", (move) => {
			const roomId = getRoomId();
			addMove(roomId, socket.id, move);
			socket.broadcast.to(roomId).emit("user_draw", move, socket.id);
		});
		socket.on("undo", () => {
			const roomId = getRoomId();
			undoMove(roomId, socket.id);
			socket.broadcast.to(roomId).emit("user_undo", socket.id);
		});

		socket.on("mouse_move", (x, y) => {
			socket.broadcast
				.to(getRoomId())
				.emit("mouse_moved", x, y, socket.id);
		});
		socket.on("disconnecting", () => {
			io.to(getRoomId()).emit("user_disconnected", socket.id);

			const user = rooms.get(getRoomId())?.get(socket.id);
			if (user?.length === 0) {
				rooms.get(getRoomId())?.delete(socket.id);
			}

			console.log("disconnected from server");
		});
	});

	app.all("*", (req: any, res: any) => nextHandler(req, res));

	server.listen(port, () => {
		// eslint-disable-next-line no-console
		console.log(`> Ready on http://localhost:${port}`);
	});
});
