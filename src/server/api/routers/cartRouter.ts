import { inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  TRPCContext,
} from "~/server/api/trpc";

const CartItemUpdateSchema = z.object({
  productId: z.number().int(),
  quantity: z.number().int().positive().default(1),
});

const CartIdSchema = z.object({
  cartId: z.number().int(),
});

export const CartRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.number().int())
    .query(({ ctx, input }) => getCartById(ctx, input)),
  createCart: protectedProcedure
    .input(CartItemUpdateSchema)
    .mutation(async ({ ctx, input: { productId, quantity } }) => {
      const { id: userId } = ctx.session.user;
      return ctx.prisma.cart.create({
        data: {
          userId: userId,
          cartItems: { create: { quantity, bookId: productId } },
        },
      });
    }),
  updateCartItem: protectedProcedure
    .input(CartItemUpdateSchema.merge(CartIdSchema))
    .mutation(async ({ ctx, input: { cartId, productId, quantity } }) => {
      const cart: ICart = await getCartById(ctx, cartId);
      const existingCartItem = cart.cartItems.find(
        (item) => item.product.id === productId
      );
      const removeProduct = quantity === 0;

      if (existingCartItem) {
        if (removeProduct) {
          await ctx.prisma.cart.update({
            where: { id: cartId },
            data: { cartItems: { delete: { id: existingCartItem.id } } },
          });
        }
        existingCartItem.quantity += 1;
        await ctx.prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 },
        });
      } else if (!removeProduct) {
        await ctx.prisma.cart.update({
          where: { id: cartId },
          data: { cartItems: { create: { bookId: productId, quantity: 1 } } },
        });
      }
    }),
  clearCart: protectedProcedure
    .input(z.number().int())
    .mutation(async ({ ctx, input: cartId }) => {
      await ctx.prisma.cart.update({
        where: { id: cartId },
        data: { cartItems: { deleteMany: {} } },
      });
    }),
});

export type ICart = inferAsyncReturnType<typeof getCartById>;
export type ICartItem = ICart["cartItems"][0];

async function getCartById(ctx: TRPCContext, id: number) {
  return await ctx.prisma.cart.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      userId: true,
      cartItems: {
        select: {
          id: true,
          quantity: true,
          product: {
            select: {
              id: true,
              price: true,
              currentPrice: true,
              discount: true,
              title: true,
            },
          },
        },
      },
    },
  });
}
