import { createTRPCRouter } from "~/server/api/trpc";
import { AuthorRouter } from "./routers/authorRouter";
import { BookRouter } from "./routers/bookRouter";
import { CartRouter } from "./routers/cartRouter";
import { OrderRouter } from "./routers/orderRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  book: BookRouter,
  cart: CartRouter,
  order: OrderRouter,
  author: AuthorRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
