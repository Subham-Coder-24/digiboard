import { createServer } from "http";
import express from "express";
import next from "next";
import { Server } from "socket.io";

import {} from "@/common/types/global";

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

	io.on("connection", (socket) => {
		console.log(` User connected: ${socket.id}`);

		socket.join("global");
		const allUser = io.sockets.adapter.rooms.get("global");
		if (allUser) io.to("global").emit("users_in_room", [...allUser]);

		socket.on("draw", (move) => {
			console.log("drawing", socket.id);

			socket.broadcast.emit("user_draw", move, socket.id);
		});
		socket.on("undo", () => {
			console.log("undo");
			socket.broadcast.emit("user_undo", socket.id);
		});

		socket.on("mouse_move", (x, y) => {
			// console.log("mouse_move");
			socket.broadcast.emit("mouse_moved", x, y, socket.id);
		});
		socket.on("disconnect", () => {
			console.log(`User disconnected: ${socket.id}`);
		});
	});

	app.all("*", (req: any, res: any) => nextHandler(req, res));

	server.listen(port, () => {
		// eslint-disable-next-line no-console
		console.log(`> Ready on http://localhost:${port}`);
	});
});
