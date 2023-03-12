import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const bookRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.book.findMany({
      include: { authors: true, publisher: true },
    });
  }),
  getByAuthor: publicProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.prisma.book.findMany({
      where: { authors: { some: { id: input } } },
    });
  }),
});
