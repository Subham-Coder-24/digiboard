import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { socket } from "@/common/lib/socket";

const Home = () => {
	const [roomId, setRoomId] = useState("");
	const router = useRouter();

	useEffect(() => {
		socket.on("created", (roomIdFromServer) => {
			router.push(roomIdFromServer);
		});

		const handleJoinedRoom = (
			roomIdFromServer: string,
			failed?: boolean
		) => {
			if (!failed) {
				router.push(roomIdFromServer);
			} else {
				console.log("Failed to join room.");
			}
		};

		socket.on("joined", handleJoinedRoom);

		return () => {
			socket.off("created");
			socket.off("joined", handleJoinedRoom);
		};
	}, [roomId, router]);

	useEffect(() => {
		socket.emit("leave_room");
	}, []);

	const handleCreateRoom = () => {
		socket.emit("create_room");
	};

	const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (roomId) socket.emit("join_room", roomId);
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-white text-black px-4">
			<div className="w-full max-w-md rounded-2xl bg-gray-50 p-8 shadow-lg">
				<h1 className="text-center text-4xl font-extrabold mb-2">
					Digiboard
				</h1>
				<h3 className="text-center text-lg font-medium mb-6">
					Real-time whiteboard
				</h3>

				<form className="flex flex-col gap-4" onSubmit={handleJoinRoom}>
					<label htmlFor="room-id" className="font-semibold">
						Enter Room ID
					</label>
					<input
						id="room-id"
						placeholder="Room id..."
						className="w-full rounded-md border border-gray-300 px-4 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						value={roomId}
						onChange={(e) => setRoomId(e.target.value)}
					/>
					<button
						className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
						type="submit"
					>
						Join Room
					</button>
				</form>

				<div className="my-6 flex items-center gap-2">
					<div className="h-px flex-grow bg-gray-300" />
					<span className="text-sm text-gray-500">or</span>
					<div className="h-px flex-grow bg-gray-300" />
				</div>

				<div className="flex flex-col gap-3">
					<label className="font-semibold">Create New Room</label>
					<button
						className="rounded-md bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
						onClick={handleCreateRoom}
					>
						Create Room
					</button>
				</div>
			</div>
		</div>
	);
};

export default Home;
