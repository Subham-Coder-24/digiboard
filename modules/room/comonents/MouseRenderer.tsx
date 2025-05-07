import { useEffect, useState } from "react";
import { socket } from "@/common/lib/socket";
import SocketMouse from "./SocketMouse";

const MouseRenderer = () => {
	const [mouses, setMouses] = useState<string[]>([]);

	useEffect(() => {
		const handleUsersInRoom = (socketIds: string[]) => {
			const allUsers = socketIds.filter(
				(socketId) => socketId !== socket.id
			);
			setMouses(allUsers);
		};

		socket.on("users_in_room", handleUsersInRoom);

		return () => {
			socket.off("users_in_room", handleUsersInRoom);
		};
	}, []);

	return (
		<>
			{mouses.map((socketId) => (
				<SocketMouse socketId={socketId} key={socketId} />
			))}
		</>
	);
};

export default MouseRenderer;
