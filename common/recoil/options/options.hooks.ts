"use client";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { optionsAtom } from "./options.atom";

export const useOptions = () => {
	const options = useRecoilValue(optionsAtom);

	return options;
};
