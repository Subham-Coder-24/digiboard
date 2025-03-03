/* eslint-disable import/no-cycle */
"use client";
import { optionsAtom } from "./options.atom";
import { useOptions } from "./options.hooks";

export default optionsAtom;

export { useOptions };
