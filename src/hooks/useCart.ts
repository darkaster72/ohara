import { useAtom } from "jotai";
import { api } from "~/utils/api";

import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import { cartIdAtom } from "~/atoms/cartAtom";
import { ICart } from "~/server/api/routers/cartRouter";

const cartApi = api.cart;

export const useCart = () => {
  const { status } = useSession();
  const [cartId, setCartId] = useAtom(cartIdAtom);
  const utils = api.useContext();

  const {
    data: cart,
    isLoading,
    isFetching,
  } = cartApi.getById.useQuery(cartId!, {
    enabled: !!cartId && status === "authenticated",
  });

  const { mutate: createCartMutation } = cartApi.createCart.useMutation({
    onSuccess: (cart) => {
      setCartId(cart.id);
    },
  });

  const { mutate: updateCartItemMutation } = cartApi.updateCartItem.useMutation(
    {
      onSuccess: () => utils.cart.invalidate(),
    }
  );

  const { mutate: clearCartMutation } = cartApi.clearCart.useMutation({
    onSuccess: () => utils.cart.invalidate(),
  });

  const updateCartItem = async (productId: number, quantity?: number) => {
    if (cartId) {
      updateCartItemMutation({
        cartId: cartId,
        productId: productId,
        quantity,
      });
    } else {
      createCartMutation({ productId, quantity });
    }
  };

  const removeCartItem = async (productId: number) => {
    if (!cartId) {
      throw new Error("Cart note available");
    }
    updateCartItemMutation({
      cartId: cartId,
      productId: productId,
      quantity: 0,
    });
  };

  const clearCart = async () => {
    cartId && clearCartMutation(cartId);
  };

  return {
    cart: cart && new Cart(cart),
    isLoading,
    isFetching,
    removeCartItem,
    updateCartItem,
    clearCart,
  };
};

class Cart {
  constructor(private data: ICart) {}

  get cartItems() {
    return this.data.cartItems;
  }

  get isEmpty() {
    return this.cartItems.length === 0;
  }

  get totalPrice() {
    return this.data.cartItems.reduce(
      (acc, item) => acc.plus(item.product.currentPrice.mul(item.quantity)),
      new Prisma.Decimal(0)
    );
  }

  get totalQuantity() {
    return this.data.cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  }

  hasCartItem(productId: number) {
    return this.cartItems.some((p) => p.product.id === productId);
  }

  getCartItem(productId: number) {
    return this.cartItems.find((p) => p.product.id === productId);
  }
}
