import { Prisma } from "@prisma/client";
import { ICartItem } from "~/server/api/routers/cartRouter";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export function usePrice(
  price:
    | ICartItem["product"]["currentPrice"]
    | Pick<
        ICartItem["product"],
        "price" | "currentPrice" | "discount"
      > = new Prisma.Decimal(0)
) {
  const isNumericInput = Prisma.Decimal.isDecimal(price);
  const currentPrice = isNumericInput ? price : price.currentPrice;
  const originalPrice = isNumericInput ? price : price.price;
  const discount = isNumericInput
    ? new Prisma.Decimal(0)
    : price.discount ?? new Prisma.Decimal(0);
  return {
    formattedPrice: formatter.format(currentPrice.toNumber()),
    originalPrice: formatter.format(originalPrice.toNumber()),
    discount,
    isDiscounted: !discount.isZero,
  };
}
