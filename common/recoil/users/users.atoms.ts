import { atom, selector } from "recoil";

// Atom to hold user data
export const usersAtom = atom<{ [key: string]: [number, number][][] }>({
	key: "users",
	default: {},
});

// Selector to extract user IDs (keys from the usersAtom object)
export const userIds = selector({
	key: "userIds",
	get: ({ get }) => {
		const users = get(usersAtom);
		console.log("from atoms--", users);

		return Object.keys(users);
	},
});
