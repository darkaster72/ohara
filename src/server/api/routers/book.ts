import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const bookRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.string().optional())
    .query(({ ctx, input }) => {
      const searchQuery = input ? { title: { search: input } } : {};
      return ctx.prisma.book.findMany({
        where: searchQuery,
        select: {
          id: true,
          title: true,
          price: true,
          currentPrice: true,
          discount: true,
        },
        take: 20,
      });
    }),
  getByAuthor: publicProcedure
    .input(z.string().nonempty())
    .query(({ input, ctx }) => {
      return ctx.prisma.book.findMany({
        where: { authors: { some: { id: input } } },
      });
    }),
  getByPublisher: publicProcedure
    .input(z.string().nonempty())
    .query(({ input, ctx }) => {
      return ctx.prisma.book.findMany({
        where: { publisherId: input },
      });
    }),
  getById: publicProcedure
    .input(z.string().nonempty())
    .query(({ input, ctx }) => {
      return ctx.prisma.book.findUniqueOrThrow({
        where: { id: input },
        include: { authors: true, publisher: true },
      });
    }),
});
