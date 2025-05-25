import { RgbaColor } from "react-colorful";

export declare global {
	type Shape = "line" | "circle" | "rect" | "image";
	type CtxMode = "eraser" | "draw" | "select";

	type Room = Map<string, Move[]>;

	interface CtxOptions {
		lineWidth: number;
		lineColor: RgbaColor;
	}
	// combining path and option in one inteface
	interface Move {
		path: [number, number][];
		options: CtxOptions;
	}

	interface ServerToClientEvents {
		room: (room: string) => void;
		created: (roomId: string) => void;
		joined: (roomId: string, failed?: boolean) => void;
		user_draw: (move: Move, userId: string) => void;
		user_undo: (userId: string) => void;
		mouse_moved: (x: number, y: number, userId: string) => void;
		new_user: (userId: string) => void;
		user_disconnected: (userId: string) => void;
	}

	interface ClientToServerEvents {
		draw: (move: Move) => void;
		mouse_move: (x: number, y: number) => void;
		undo: () => void;
		create_room: () => void;
		join_room: (room: string) => void;
		joined_room: () => void;
		leave_room: () => void;
	}
}
