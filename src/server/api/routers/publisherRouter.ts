import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const PublisherRouter = createTRPCRouter({
  getById: publicProcedure.input(z.number().int()).query(({ input, ctx }) => {
    return ctx.prisma.publisher.findUniqueOrThrow({
      where: { id: input },
    });
  }),
});
