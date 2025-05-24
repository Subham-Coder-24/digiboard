import { useRecoilValue } from "recoil";
import { userIds, usersAtom } from "./users.atoms"; // Corrected import path

// Custom hook to get user IDs
export const useUserIds = () => {
	const users = useRecoilValue(userIds);
	return users;
};

// Custom hook to get all users
export const useUsers = () => {
	const users = useRecoilValue(usersAtom);
	return users;
};
