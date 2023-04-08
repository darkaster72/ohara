import { inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  TRPCContext,
} from "~/server/api/trpc";

export const OrderRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.number())
    .query(({ ctx, input }) => getOrderById(ctx, input)),
});

export type IOrder = inferAsyncReturnType<typeof getOrderById>;
export type ILineItem = IOrder["lineItems"][0];

async function getOrderById(ctx: TRPCContext, code: number) {
  return await ctx.prisma.order.findUniqueOrThrow({
    where: { id: code },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      total: true,
      subtotal: true,
      orderDate: true,
      lineItems: {
        select: {
          id: true,
          quantity: true,
          price: true,
          currentPrice: true,
          discount: true,
          book: {
            select: {
              id: true,
              title: true,
              authors: { select: { name: true } },
            },
          },
        },
      },
      address: {
        select: {
          address: true,
          city: true,
          state: true,
          country: true,
          postalCode: true,
          fullName: true,
          phone: true,
        },
      },
    },
  });
}
