import { atom } from "jotai";
import { createTRPCJotai } from "jotai-trpc";
import { atomWithStorage } from "jotai/utils";
import { Cart } from "~/types";
import { CartRouter } from "~/server/api/routers/cartRouter";

export const cartIdAtom = atomWithStorage<number | null>("cartId", null);

export const cartAtom = atom<Cart | null>(null);
