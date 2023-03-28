import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Cart } from "~/types";

export const cartCode = atomWithStorage<string | null>("cartCode", null);

export const cartAtom = atom<Cart | null>(null);
