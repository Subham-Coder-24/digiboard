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
		socket.on("draw", (moves, options) => {
			console.log("drawing");
			// console.log(moves);
			// console.log(options);

			socket.broadcast.emit("socket_draw", moves, options);
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
