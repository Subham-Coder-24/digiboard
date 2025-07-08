import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import { useViewportSize } from "@/common/hooks/useViewportSize";
import { motion, useMotionValue } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useBoardPosition } from "../../hooks/useBoardPosition";
import { useRefs } from "../../hooks/useRefs";
// import { useBoardPosition } from "../hooks/useBoardPosition";

const MiniMap = ({
	dragging,
	setMovedMinimap,
}: {
	dragging: boolean;
	setMovedMinimap: Dispatch<SetStateAction<boolean>>;
}) => {
	const { x, y } = useBoardPosition();
	const { minimapRef } = useRefs();
	const containerRef = useRef<HTMLDivElement>(null);
	const { width, height } = useViewportSize();
	const miniX = useMotionValue(0);
	const miniY = useMotionValue(0);

	useEffect(() => {
		const updateX = (newX: number) => {
			if (dragging) x.set(Math.floor(-newX * 7));
		};

		const updateY = (newY: number) => {
			if (dragging) y.set(Math.floor(-newY * 7));
		};

		const unsubscribeX = miniX.onChange(updateX);
		const unsubscribeY = miniY.onChange(updateY);

		return () => {
			unsubscribeX();
			unsubscribeY();
		};
	}, [dragging, miniX, miniY, x, y]);

	return (
		<div
			className="absolute right-2 top-2 z-30 overflow-hidden rounded-lg shadow-lg bg-zinc-50"
			style={{
				width: CANVAS_SIZE.width / 15,
				height: CANVAS_SIZE.height / 15,
			}}
			ref={containerRef}
		>
			<canvas
				ref={minimapRef}
				width={CANVAS_SIZE.width}
				height={CANVAS_SIZE.height}
				className="h-full w-full"
			/>
			<motion.div
				drag
				dragConstraints={containerRef}
				dragElastic={0}
				dragTransition={{ power: 0, timeConstant: 0 }}
				onDragStart={() => setMovedMinimap((prev) => !prev)}
				onDragEnd={() => setMovedMinimap(false)}
				className="absolute top-0 left-0 cursor-grab rounded-lg border-2 border-red-500"
				style={{
					width: width / 15,
					height: height / 15,
					x: miniX,
					y: miniY,
				}}
				animate={{ x: -x / 7, y: -y / 7 }}
				transition={{ duration: 0 }}
			/>
		</div>
	);
};

export default MiniMap;
