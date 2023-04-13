import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const AuthorRouter = createTRPCRouter({
  getById: publicProcedure.input(z.number().int()).query(({ input, ctx }) => {
    return ctx.prisma.author.findUniqueOrThrow({
      where: { id: input },
    });
  }),
});
