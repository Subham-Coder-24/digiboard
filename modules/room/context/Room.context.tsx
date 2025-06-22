import { createContext, ReactNode, useEffect } from "react";

import { MotionValue, useMotionValue } from "framer-motion";
import { socket } from "@/common/lib/socket";
import { useSetRoom, useSetUsers } from "@/common/recoil/room/room.hooks";

export const roomContext = createContext<{
	x: MotionValue<number>;
	y: MotionValue<number>;
}>(null!);

const RoomContextProvider = ({ children }: { children: ReactNode }) => {
	const setRoom = useSetRoom();
	const { handleAddUser, handleRemoveUser } = useSetUsers();

	const x = useMotionValue(0);
	const y = useMotionValue(0);

	useEffect(() => {
		const handleRoom = (
			room: any,
			usersMovesToParse: string,
			usersToParse: string
		) => {
			const usersMoves = new Map<string, Move[]>(
				JSON.parse(usersMovesToParse)
			);
			const users = new Map<string, string>(JSON.parse(usersToParse));

			setRoom((prev) => ({
				...prev,
				users,
				usersMoves,
				movesWithoutUser: room.drawed, // assuming `room.drawed` is valid
			}));
		};

		const handleNewUser = (userId: string, username: string) => {
			handleAddUser(userId, username); // your logic to add new user
		};

		socket.on("room", handleRoom);
		socket.on("new_user", handleNewUser);

		socket.on("user_disconnected", (userId: string) => {
			handleRemoveUser(userId);
		});

		return () => {
			socket.off("room");
			socket.off("new_user");
			socket.off("user_disconnected");
		};
	}, [handleAddUser, handleRemoveUser, setRoom]);

	return (
		<roomContext.Provider
			value={{
				x,
				y,
			}}
		>
			{children}
		</roomContext.Provider>
	);
};

export default RoomContextProvider;
