import { inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  TRPCContext,
} from "~/server/api/trpc";

const CartItemUpdateSchema = z.object({
  productId: z.number().int(),
  quantity: z.number().int().default(1),
});

const CartCodeSchema = z.object({
  cartCode: z.string().cuid(),
});

const ShippingAddressUpdateSchema = z.object({
  cartCode: z.string().cuid(),
  address: z.object({
    fullName: z.string(),
    city: z.string(),
    state: z.string(),
    address: z.string(),
    country: z.string(),
    phone: z.string(),
    postalCode: z.string(),
  }),
});

export const CartRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.string().cuid())
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
    .input(CartItemUpdateSchema.merge(CartCodeSchema))
    .mutation(async ({ ctx, input: { cartCode, productId, quantity } }) => {
      const cart: ICart = await getCartById(ctx, cartCode);
      const existingCartItem = cart.cartItems.find(
        (item) => item.book.id === productId
      );
      const removeProduct = quantity === 0;

      if (existingCartItem) {
        if (removeProduct) {
          await ctx.prisma.cart.update({
            where: { code: cartCode },
            data: { cartItems: { delete: { id: existingCartItem.id } } },
          });
        }

        await ctx.prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: quantity },
        });
      } else if (!removeProduct) {
        await ctx.prisma.cart.update({
          where: { code: cartCode },
          data: {
            cartItems: { create: { bookId: productId, quantity } },
          },
        });
      }
    }),
  updateAddress: protectedProcedure
    .input(ShippingAddressUpdateSchema)
    .mutation(async ({ ctx, input: { cartCode, address } }) => {
      await ctx.prisma.cart.update({
        where: { code: cartCode },
        data: {
          address: {
            upsert: { create: { ...address }, update: { ...address } },
          },
        },
      });
    }),
  clearCart: protectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input: cartCode }) => {
      await ctx.prisma.cart.update({
        where: { code: cartCode },
        data: { cartItems: { deleteMany: {} } },
      });
    }),
});

export type ICart = inferAsyncReturnType<typeof getCartById>;
export type ICartItem = ICart["cartItems"][0];

async function getCartById(ctx: TRPCContext, code: string) {
  return await ctx.prisma.cart.findUniqueOrThrow({
    where: { code },
    select: {
      code: true,
      userId: true,
      cartItems: {
        select: {
          id: true,
          quantity: true,
          book: {
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
