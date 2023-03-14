import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const bookRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.book.findMany({
      include: { authors: true, publisher: true },
      take: 10,
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
