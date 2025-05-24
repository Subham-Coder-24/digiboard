import { useEffect, useState } from "react";
import { socket } from "@/common/lib/socket";
import UserMouse from "./userMouse";
import { useUserIds } from "@/common/recoil/users";

const MouseRenderer = () => {
	const userIds = useUserIds();

	return (
		<>
			{userIds.map((userId) => (
				<UserMouse userId={userId} key={userId} />
			))}
		</>
	);
};

export default MouseRenderer;
