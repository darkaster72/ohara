import { useAtom } from "jotai";
import { api } from "~/utils/api";

import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { cartCode } from "~/atoms/cartAtom";
import { ShippingForm } from "~/components/shipping-form";
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

  const { mutate: placeOrderMutation } = cartApi.placeOrder.useMutation({
    onSuccess: () => utils.cart.invalidate(),
  });

  const { mutate: updateAddressMutation } = cartApi.updateAddress.useMutation({
    onSuccess: () => utils.cart.invalidate(),
  });

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

  const updateAddress = (address: ShippingForm) => {
    if (!cartId) throw new Error("Cart note available");
    updateAddressMutation({ address, cartCode: cartId });
  };

  const placeOrder = (callback?: Parameters<typeof placeOrderMutation>[1]) => {
    if (!cartId) throw new Error("Cart note available");
    placeOrderMutation(cartId, callback);
  };

  const removeCartItem = async (productId: number) => {
    if (!cartId) throw new Error("Cart note available");

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
    updateAddress,
    placeOrder,
  };
};

class Cart implements ICart {
  userId: string;
  cartItems: ICartItem[];
  code: string;
  address: ShippingForm | null;
  subtotal: Prisma.Decimal;
  total: Prisma.Decimal;

  constructor(data: ICart) {
    this.cartItems = data.cartItems.map((p) => new CartItem(p));
    this.userId = data.userId;
    this.code = data.code;
    this.address = data.address;
    this.subtotal = new Prisma.Decimal(data.subtotal);
    this.total = new Prisma.Decimal(data.total);
  }

  get isEmpty(): boolean {
    return this.cartItems.length === 0;
  }

  get isValid(): boolean {
    return !this.isEmpty || !!this.address;
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
