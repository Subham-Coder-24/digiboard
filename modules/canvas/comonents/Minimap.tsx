import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import { useViewportSize } from "@/common/hooks/useViewportSize";
import { motion, MotionValue, useMotionValue } from "framer-motion";
import { Dispatch, SetStateAction, forwardRef, useEffect, useRef } from "react";

const MiniMap = forwardRef<
	HTMLCanvasElement,
	{
		x: MotionValue<number>;
		y: MotionValue<number>;
		dragging: boolean;
		setMovedMinimap: Dispatch<SetStateAction<boolean>>;
	}
>(({ x, y, dragging, setMovedMinimap }, ref) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const { width, height } = useViewportSize();
	const miniX = useMotionValue(0);
	const miniY = useMotionValue(0);

	useEffect(() => {
		const updateX = (newX: number) => {
			if (dragging) x.set(-newX * 10);
		};

		const updateY = (newY: number) => {
			if (dragging) y.set(-newY * 10);
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
			className="absolute right-10 top-10 z-30 overflow-hidden rounded-lg shadow-lg"
			style={{
				width: CANVAS_SIZE.width / 10,
				height: CANVAS_SIZE.height / 10,
			}}
			ref={containerRef}
		>
			<canvas
				ref={ref}
				width={CANVAS_SIZE.width}
				height={CANVAS_SIZE.height}
				className="h-full w-full"
			/>
			<motion.div
				drag
				dragConstraints={containerRef}
				dragElastic={0}
				dragTransition={{ power: 0, timeConstant: 0 }}
				// onDragStart={() => setDraggingMinimap(true)}
				onDragEnd={() => setMovedMinimap((prev: boolean) => !prev)}
				className="absolute top-0 left-0 cursor-grab rounded-lg border-2 border-red-500"
				style={{
					width: width / 10,
					height: height / 10,
					x: miniX,
					y: miniY,
				}}
				animate={{ x: -x / 10, y: -y / 10 }}
				transition={{ duration: 0 }}
			/>
		</div>
	);
});

export default MiniMap;
