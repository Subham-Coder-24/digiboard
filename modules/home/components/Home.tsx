import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { socket } from "@/common/lib/socket";
import { useModal } from "@/common/recoil/modal";
import { useSetRoomId } from "@/common/recoil/room";
import NotFoundModal from "../modals/NotFound";
const Home = () => {
	const [username, setUsername] = useState("");
	const [roomId, setRoomId] = useState("");
	const router = useRouter();
	const setAtomRoomId = useSetRoomId();
	const { openModal } = useModal();
	useEffect(() => {
		socket.on("created", (roomIdFromServer) => {
			setAtomRoomId(roomIdFromServer);
			router.push(roomIdFromServer);
		});

		const handleJoinedRoom = (
			roomIdFromServer: string,
			failed?: boolean
		) => {
			if (!failed) {
				setAtomRoomId(roomIdFromServer);
				router.push(roomIdFromServer);
			} else {
				openModal(<NotFoundModal id={roomId} />);
			}
		};

		socket.on("joined", handleJoinedRoom);

		return () => {
			socket.off("created");
			socket.off("joined", handleJoinedRoom);
		};
	}, [openModal, roomId, router, setAtomRoomId]);

	useEffect(() => {
		socket.emit("leave_room");
	}, []);

	const handleCreateRoom = () => {
		socket.emit("create_room", username);
	};

	const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (roomId) socket.emit("join_room", roomId, username);
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
				<div className="mt-10 flex flex-col gap-2">
					<label className="self-start font-bold leading-tight">
						Enter your name
					</label>
					<input
						className="input"
						id="room-id"
						placeholder="Username..."
						value={username}
						onChange={(e) =>
							setUsername(e.target.value.slice(0, 15))
						}
					/>
				</div>

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
