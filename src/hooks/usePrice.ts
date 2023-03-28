import { Prisma } from "@prisma/client";
import { isString } from "lodash";
import { ICartItem } from "~/server/api/routers/cartRouter";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const DecimalZero = new Prisma.Decimal(0);
export function usePrice(
  price:
    | ICartItem["product"]["currentPrice"]
    | Pick<
        ICartItem["product"],
        "price" | "currentPrice" | "discount"
      > = DecimalZero
) {
  const isPriceSingular = isString(price) || Prisma.Decimal.isDecimal(price);
  const currentPrice = new Prisma.Decimal(
    isPriceSingular ? price : price.currentPrice
  );
  const originalPrice = new Prisma.Decimal(
    isPriceSingular ? price : price.price
  );
  const discount = new Prisma.Decimal(
    isPriceSingular ? DecimalZero : price.discount ?? DecimalZero
  );
  return {
    formattedPrice: formatter.format(currentPrice.toNumber()),
    originalPrice: formatter.format(originalPrice.toNumber()),
    discount,
    isDiscounted: !discount.isZero,
  };
}
