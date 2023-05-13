import { TRPCError, type inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  type TRPCContext,
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
      const user = ctx.session.user;
      const book = await ctx.prisma.book.findUniqueOrThrow({
        where: { id: productId },
      });

      if (book.quantityAvailable < quantity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Product with quantity ${quantity} is not available`,
        });
      }

      const total = book.currentPrice.toNumber() * quantity;
      return ctx.prisma.cart.create({
        data: {
          user: {
            connectOrCreate: {
              where: { email: user.email! },
              create: { ...user },
            },
          },
          cartItems: { create: { quantity, bookId: productId } },
          subtotal: total,
          total: total,
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

        if (existingCartItem.book.quantityAvailable < quantity) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Product with quantity ${quantity} is not available`,
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
      const cartWithItems = await ctx.prisma.cart.findUniqueOrThrow({
        where: { code: cartCode },
        select: {
          cartItems: {
            select: {
              book: { select: { currentPrice: true } },
              quantity: true,
            },
          },
        },
      });
      const total = cartWithItems.cartItems
        .map((item) => item.book.currentPrice.toNumber() * item.quantity)
        .reduce((acc, cur) => acc + cur, 0);
      return await ctx.prisma.cart.update({
        where: { code: cartCode },
        data: { total: total, subtotal: total },
      });
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
  placeOrder: protectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input: cartCode }) => {
      const cart: ICart = await getCartById(ctx, cartCode);

      if (!cart.cartItems.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot place order for empty cart",
        });
      }

      if (!cart.address) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Shipping Address not set",
        });
      }

      const outOfStockItems = cart.cartItems.filter(
        (item) => item.quantity > item.book.quantityAvailable
      );

      if (outOfStockItems.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Some items are no longer availble",
        });
      }

      return await ctx.prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            cartCode: cart.code,
            user: { connect: { id: cart.userId } },
            address: { create: cart.address! },
            orderDate: new Date(),
            total: cart.total,
            subtotal: cart.subtotal,
            lineItems: {
              createMany: {
                data: cart.cartItems.map((c) => ({
                  bookId: c.book.id,
                  quantity: c.quantity,
                  currentPrice: c.book.currentPrice,
                  price: c.book.price,
                  discount: c.book.discount,
                })),
              },
            },
          },
        });

        for (const item of cart.cartItems) {
          await tx.book.update({
            data: {
              quantityAvailable: item.book.quantityAvailable - item.quantity,
            },
            where: { id: item.book.id },
          });
        }
        return order;
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
      subtotal: true,
      total: true,
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
              quantityAvailable: true,
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
