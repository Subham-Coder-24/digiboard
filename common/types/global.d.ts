import { RgbaColor } from "react-colorful";

export declare global {
	type Shape = "line" | "circle" | "rect" | "image";
	type CtxMode = "eraser" | "draw" | "select";
	type RgbaColor = {
		r: number;
		g: number;
		b: number;
		a: number;
	};
	// type Room = Map<string, Move[]>;
	// type Room = { users: Map<string, Move[]>; drawed: Move[] };
	type Room = {
		usersMoves: Map<string, Move[]>;
		drawed: Move[];
		users: Map<string, string>;
	};
	interface User {
		name: string;
		color: string;
	}

	interface CtxOptions {
		lineWidth: number;
		lineColor: RgbaColor;
	}
	// combining path and option in one inteface
	interface Move {
		path: [number, number][];
		options: CtxOptions;
	}
	interface ClientRoom {
		id: string;
		usersMoves: Map<string, Move[]>;
		movesWithoutUser: Move[];
		myMoves: Move[];
		users: Map<string, User>;
	}

	interface ServerToClientEvents {
		room_exists: (exists: boolean) => void;
		room: (
			room: Room,
			usersMovesToParse: string,
			usersToParse: string
		) => void;
		created: (roomId: string) => void;
		joined: (roomId: string, failed?: boolean) => void;
		user_draw: (move: Move, userId: string) => void;
		user_undo: (userId: string) => void;
		mouse_moved: (x: number, y: number, userId: string) => void;
		new_user: (userId: string, username: string) => void;
		user_disconnected: (userId: string) => void;
	}

	interface ClientToServerEvents {
		check_room: (roomId: string) => void;
		draw: (move: Move) => void;
		mouse_move: (x: number, y: number) => void;
		undo: () => void;
		create_room: (username: string) => void;
		join_room: (room: string, username: string) => void;
		joined_room: () => void;
		leave_room: () => void;
	}
}
