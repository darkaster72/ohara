import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const bookRouter = createTRPCRouter({
  getAllBooks: publicProcedure
    .input(z.string().optional())
    .query(({ ctx, input }) => {
      const searchQuery = input ? { title: { search: input } } : {};
      return ctx.prisma.book.findMany({
        where: searchQuery,
        take: 20,
      });
    }),
  infiniteBooks: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
        search: z.string().nullish().default(null),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor, search } = input;
      const items = await ctx.prisma.book.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        select: {
          id: true,
          title: true,
          price: true,
          currentPrice: true,
          discount: true,
        },
        where: search ? { title: { search } } : {},
        cursor: cursor ? { id: cursor.valueOf() } : undefined,
        orderBy: {
          id: "asc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
  getByAuthorId: publicProcedure
    .input(z.number().int())
    .query(({ input, ctx }) => {
      return ctx.prisma.book.findMany({
        where: { authors: { some: { id: input } } },
      });
    }),
  getByPublisherId: publicProcedure
    .input(z.number().int())
    .query(({ input, ctx }) => {
      return ctx.prisma.book.findMany({
        where: { publisherId: input },
      });
    }),
  getByBookId: publicProcedure
    .input(z.number().int())
    .query(({ input, ctx }) => {
      return ctx.prisma.book.findUniqueOrThrow({
        where: { id: input },
        include: { authors: true, publisher: true },
      });
    }),
});
