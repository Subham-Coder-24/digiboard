import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BsCursorFill } from "react-icons/bs";
import { useBoardPosition } from "../hooks/useBoardPosition";
import { socket } from "@/common/lib/socket";

interface SocketMouseProps {
	userId: string;
}

const UserMouse = ({ userId }: { userId: string }) => {
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
			className={`absolute top-0 left-0 text-blue-800 ${
				pos.x === -1 ? "hidden" : ""
			} pointer-events-none`}
			animate={{ x: pos.x + x, y: pos.y + y }}
			transition={{ duration: 0.1, ease: "linear" }}
		>
			<BsCursorFill className="-rotate-90" />
		</motion.div>
	);
};

export default UserMouse;
