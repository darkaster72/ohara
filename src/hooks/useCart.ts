import { useAtom } from "jotai";
import { api } from "~/utils/api";

import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { cartCode } from "~/atoms/cartAtom";
import { ICart, ICartItem } from "~/server/api/routers/cartRouter";

const cartApi = api.cart;

export const useCart = () => {
  const { status } = useSession();
  const [cartId, setCartId] = useAtom(cartCode);
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
      setCartId(cart.code);
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
        cartCode: cartId,
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
      cartCode: cartId,
      productId: productId,
      quantity: 0,
    });
  };

  const clearCart = async () => {
    cartId && clearCartMutation(cartId);
  };

  const getItem = useCallback(
    (id: number) => cart?.cartItems.find((item) => item.id === id),
    []
  );

  return {
    cart: cart && new Cart(cart),
    isLoading,
    isFetching,
    removeCartItem,
    updateCartItem,
    clearCart,
    getItem,
  };
};

class Cart implements ICart {
  userId: string;
  cartItems: ICartItem[];
  code: string;

  constructor(private data: ICart) {
    this.cartItems = data.cartItems.map((p) => new CartItem(p));
    this.userId = data.userId;
    this.code = data.code;
  }

  get isEmpty() {
    return this.cartItems.length === 0;
  }

  get totalPrice() {
    return this.cartItems.reduce(
      (acc, item) => acc.plus(item.book.currentPrice.mul(item.quantity)),
      new Prisma.Decimal(0)
    );
  }

  get totalQuantity() {
    return this.cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  }

  hasCartItem(productId: number) {
    return this.cartItems.some((p) => p.book.id === productId);
  }

  getCartItem(productId: number) {
    return this.cartItems.find((p) => p.book.id === productId);
  }
}

class CartItem implements ICartItem {
  book: ICartItem["book"];
  id: number;
  quantity: number;

  constructor(private data: ICartItem) {
    const book = data.book;
    this.book = {
      ...book,
      currentPrice: new Prisma.Decimal(book.currentPrice),
      discount: new Prisma.Decimal(book.discount ?? 0),
      price: new Prisma.Decimal(book.price),
    };
    this.quantity = data.quantity;
    this.id = data.id;
  }
}
