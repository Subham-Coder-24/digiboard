import { useEffect, useState } from "react";
import { socket } from "@/common/lib/socket";
import SocketMouse from "./SocketMouse";
import { useUserIds } from "@/common/recoil/users";

const MouseRenderer = () => {
	const userIds = useUserIds();

	return (
		<>
			{userIds.map((userId) => (
				<SocketMouse userId={userId} key={userId} />
			))}
		</>
	);
};

export default MouseRenderer;
