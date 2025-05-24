import { RgbaColor } from "react-colorful";

export declare global {
	type Shape = "line" | "circle" | "rect" | "image";
	type CtxMode = "eraser" | "draw" | "select";

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
		user_draw: (move: Move, userId: string) => void;
		user_undo(userId: string): void;
		mouse_moved: (x: number, y: number, socketId: string) => void;
		users_in_room: (socketIds: string[]) => void;
		user_disconnected: (scokekId: string) => void;
	}

	interface ClientToServerEvents {
		mouse_move: (x: number, y: number) => void;
		draw: (move: Move) => void;
		undo: () => void;
	}
}
