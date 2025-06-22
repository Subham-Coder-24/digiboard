import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BsCursorFill } from "react-icons/bs";
import { useBoardPosition } from "../hooks/useBoardPosition";
import { socket } from "@/common/lib/socket";
import { useRoom } from "@/common/recoil/room";

interface SocketMouseProps {
	userId: string;
}

const UserMouse = ({ userId }: { userId: string }) => {
	const { users } = useRoom();
	const boardPos = useBoardPosition();
	const [x, setX] = useState(boardPos.x.get());
	const [y, setY] = useState(boardPos.y.get());
	const [pos, setPos] = useState({ x: -1, y: -1 });

	useEffect(() => {
		const unsubscribe = boardPos.x.onChange(setX);
		return unsubscribe;
	}, [boardPos.x]);

	useEffect(() => {
		const unsubscribe = boardPos.y.onChange(setY);
		return unsubscribe;
	}, [boardPos.y]);

	useEffect(() => {
		const handleMouseMoved = (
			newX: number,
			newY: number,
			socketIdMoved: string
		) => {
			if (socketIdMoved === userId) {
				setPos({ x: newX, y: newY });
			}
		};

		socket.on("mouse_moved", handleMouseMoved);
		return () => {
			socket.off("mouse_moved", handleMouseMoved);
		};
	}, [userId]);

	return (
		<motion.div
			className={`pointer-events-none absolute top-0 left-0 z-20 text-blue-800 ${
				pos.x === -1 && "hidden"
			}`}
			style={{ color: users.get(userId)?.color }}
			animate={{ x: pos.x + x, y: pos.y + y }}
			transition={{ duration: 0.2, ease: "linear" }}
		>
			<BsCursorFill className="-rotate-90" />
			<p className="ml-2">{users.get(userId)?.name || "Anonymous"}</p>
		</motion.div>
	);
};

export default UserMouse;
