import { createContext, ReactNode, useEffect } from "react";

import { MotionValue, useMotionValue } from "framer-motion";
import { socket } from "@/common/lib/socket";
import { useSetRecoilState } from "recoil";
import usersAtom, { useUserIds } from "@/common/recoil/users";

export const roomContext = createContext<{
	x: MotionValue<number>;
	y: MotionValue<number>;
}>(null!);

const RoomContextProvider = ({ children }: { children: ReactNode }) => {
	const setUsers = useSetRecoilState(usersAtom);
	const userIds = useUserIds();
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	useEffect(() => {
		socket.on("users_in_room", (newUsers) => {
			newUsers.forEach((user) => {
				if (!userIds.includes(user) && user !== socket.id) {
					setUsers((prevUsers) => ({
						...prevUsers,
						[user]: [], // Example default value
					}));
				}
			});
		});

		socket.on("user_disconnected", (userId: string) => {
			setUsers((prevUsers) => {
				const newUsers = { ...prevUsers };
				delete newUsers[userId];
				return newUsers;
			});
		});

		return () => {
			socket.off("users_in_room");
			socket.off("user_disconnected");
		};
	}, [setUsers, userIds]);

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
