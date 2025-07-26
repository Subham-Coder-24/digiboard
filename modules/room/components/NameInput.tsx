import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { socket } from "@/common/lib/socket";
import { useModal } from "@/common/recoil/modal";
import { useSetRoomId } from "@/common/recoil/room";
import NotFoundModal from "@/modules/home/modals/NotFound";
import Left from "@/modules/home/components/Left";

const NameInput = () => {
	const setRoomId = useSetRoomId();
	const { openModal } = useModal();
	const [name, setName] = useState("");
	const router = useRouter();
	const roomId = (router.query.roomId || "").toString();

	useEffect(() => {
		if (!roomId) return;
		socket.emit("check_room", roomId);
		socket.on("room_exists", (exists) => {
			if (!exists) router.push("/");
		});
		return () => {
			socket.off("room_exists");
		};
	}, [roomId, router]);

	useEffect(() => {
		const handleJoined = (roomIdFromServer: string, failed?: boolean) => {
			if (failed) {
				router.push("/");
				openModal(<NotFoundModal id={roomIdFromServer} />);
			} else setRoomId(roomIdFromServer);
		};
		socket.on("joined", handleJoined);
		return () => {
			socket.off("joined", handleJoined);
		};
	}, [openModal, router, setRoomId]);

	const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		socket.emit("join_room", roomId, name);
	};
	const styles = {
		container: {
			display: "flex",
			// flexDirection: (isMobile ? 'column' : 'row') as React.CSSProperties['flexDirection'],
			minHeight: "100vh",
			fontFamily:
				"'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
		},
		rightSide: {
			flex: 1,
			background: "#ffffff",
			display: "flex",
			flexDirection: "column" as const,
			justifyContent: "center",
			alignItems: "center",
			padding: "4rem 3rem",
		},
	};

	return (
		<div style={styles.container}>
			<Left />
			<div style={styles.rightSide}>
				<form
					onSubmit={handleJoinRoom}
					className="w-full rounded-2xl bg-white p-8"
				>
					<div className="mb-6 text-center">
						<h1 className="text-3xl font-extrabold text-gray-800 sm:text-3xl">
							You're joining a CoSketch room
						</h1>
						<p className="mt-2 text-lg text-gray-600">
							You've been invited to a collaborative whiteboard
							session — join your co-workers and start sketching
							together!
						</p>
					</div>

					<div className="mx-[60px]">
						<label className="mb-2 block text-sm font-medium text-gray-700">
							Your Name
						</label>
						<input
							type="text"
							value={name}
							maxLength={15}
							onChange={(e) => setName(e.target.value)}
							className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-2 text-base shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
							placeholder="e.g. Alex"
							required
						/>

						<button
							type="submit"
							className="
                w-full
                cursor-pointer rounded-[12px]
                border-none
                bg-black
                px-8
                py-4
                text-base
                font-semibold
                uppercase
                tracking-wider text-white outline-none
                transition-all
                duration-300
                ease-in-out
                hover:bg-gray-900
                focus:ring-2 focus:ring-black focus:ring-offset-2
              "
						>
							Enter Room
						</button>
					</div>
				</form>
			</div>
			<style jsx>{`
				@keyframes radar {
					0% {
						left: -100%;
					}
					100% {
						left: 100%;
					}
				}
				@keyframes typewriter {
					0% {
						width: 0;
					}
					50% {
						width: 100%;
					}
					100% {
						width: 100%;
					}
				}
				@keyframes blink {
					0%,
					50% {
						border-color: rgba(255, 255, 255, 0.7);
					}
					51%,
					100% {
						border-color: transparent;
					}
				}
				@keyframes drawPath {
					0%,
					20% {
						stroke-dashoffset: 1000;
					}
					50%,
					80% {
						stroke-dashoffset: 0;
					}
					100% {
						stroke-dashoffset: -1000;
					}
				}

				@keyframes drawPath2 {
					0%,
					20% {
						stroke-dashoffset: 800;
					}
					50%,
					80% {
						stroke-dashoffset: 0;
					}
					100% {
						stroke-dashoffset: -800;
					}
				}

				@keyframes drawCircle {
					0%,
					20% {
						stroke-dashoffset: 188;
					}
					50%,
					80% {
						stroke-dashoffset: 0;
					}
					100% {
						stroke-dashoffset: -188;
					}
				}

				@keyframes drawRect {
					0%,
					20% {
						stroke-dashoffset: 280;
					}
					50%,
					80% {
						stroke-dashoffset: 0;
					}
					100% {
						stroke-dashoffset: -280;
					}
				}

				@keyframes floatDot {
					0%,
					100% {
						transform: translate(0, 0) scale(1);
						opacity: 0.3;
					}
					25% {
						transform: translate(20px, -30px) scale(1.5);
						opacity: 0.6;
					}
					50% {
						transform: translate(-10px, -20px) scale(0.8);
						opacity: 0.4;
					}
					75% {
						transform: translate(15px, 10px) scale(1.2);
						opacity: 0.5;
					}
				}

				@keyframes floatDot2 {
					0%,
					100% {
						transform: translate(0, 0) scale(1);
						opacity: 0.2;
					}
					33% {
						transform: translate(-25px, 20px) scale(1.3);
						opacity: 0.5;
					}
					66% {
						transform: translate(30px, -15px) scale(0.9);
						opacity: 0.3;
					}
				}

				@keyframes moveCursor {
					0% {
						top: 30%;
						left: 20%;
						opacity: 0;
					}
					10% {
						opacity: 0.4;
					}
					25% {
						top: 25%;
						left: 35%;
					}
					50% {
						top: 45%;
						left: 60%;
					}
					75% {
						top: 35%;
						left: 25%;
					}
					90% {
						opacity: 0.4;
					}
					100% {
						top: 30%;
						left: 20%;
						opacity: 0;
					}
				}

				@keyframes moveCursor2 {
					0% {
						top: 50%;
						left: 80%;
						opacity: 0;
					}
					10% {
						opacity: 0.3;
					}
					25% {
						top: 30%;
						left: 60%;
					}
					50% {
						top: 70%;
						left: 30%;
					}
					75% {
						top: 20%;
						left: 70%;
					}
					90% {
						opacity: 0.3;
					}
					100% {
						top: 50%;
						left: 80%;
						opacity: 0;
					}
				}

				@keyframes moveCursor3 {
					0% {
						top: 80%;
						left: 40%;
						opacity: 0;
					}
					10% {
						opacity: 0.2;
					}
					30% {
						top: 40%;
						left: 80%;
					}
					60% {
						top: 20%;
						left: 20%;
					}
					80% {
						top: 60%;
						left: 60%;
					}
					90% {
						opacity: 0.2;
					}
					100% {
						top: 80%;
						left: 40%;
						opacity: 0;
					}
				}

				@keyframes drawTriangle {
					0%,
					20% {
						stroke-dashoffset: 160;
					}
					50%,
					80% {
						stroke-dashoffset: 0;
					}
					100% {
						stroke-dashoffset: -160;
					}
				}

				@keyframes drawZigzag {
					0%,
					20% {
						stroke-dashoffset: 100;
					}
					50%,
					80% {
						stroke-dashoffset: 0;
					}
					100% {
						stroke-dashoffset: -100;
					}
				}

				@keyframes drawArrow {
					0%,
					20% {
						stroke-dashoffset: 80;
					}
					50%,
					80% {
						stroke-dashoffset: 0;
					}
					100% {
						stroke-dashoffset: -80;
					}
				}

				@media (max-width: 768px) {
					.container {
						flex-direction: column !important;
					}
				}
			`}</style>
		</div>
	);
};

export default NameInput;
