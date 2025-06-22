import { useEffect, useRef } from "react";

import { useRouter } from "next/router";

import { socket } from "@/common/lib/socket";
import { useRoom, useSetRoomId } from "@/common/recoil/room";

import RoomContextProvider from "../context/Room.context";
// import ToolBar from "./toolbar/ToolBar";
import NameInput from "./NameInput";
import UserList from "./UserList";
// import Canvas from "./board/Canvas";
import { MousePosition } from "./board/MousePosition";
import MousesRenderer from "./board/MouseRenderer";
import ToolBar from "./toolbar/ToolBar";
import Canvas from "./board/Canvas";
import Chat from "./chat/Chat";

const Room = () => {
	const room = useRoom();
	const undoRef = useRef<HTMLButtonElement>(null);
	if (!room.id) return <NameInput />;

	return (
		<RoomContextProvider>
			<div className="relative h-full w-full overflow-hidden">
				<UserList />
				<ToolBar undoRef={undoRef} />
				<Canvas undoRef={undoRef} />
				<MousePosition />
				<MousesRenderer />
				<Chat />
			</div>
		</RoomContextProvider>
	);
};

export default Room;
