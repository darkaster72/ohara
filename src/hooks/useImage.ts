import { useMemo } from "react";
import { type IProduct } from "~/types";

type ImageProps = Pick<IProduct, "title"> &
  Partial<Pick<IProduct, "authors" | "publisher">>;

export function useImage(
  product?: ImageProps,
  type: "card" | "cover" = "cover"
) {
  return useMemo(() => {
    if (!product) return "";
    const title = encodeURIComponent(product.title ?? "");
    const author = product.authors?.[0]?.name ?? "";
    const publisher = product.publisher?.name ?? "";
    return `/api/cover-image?title=${title}&author=${author}&publisher=${publisher}&type=${type}`;
  }, [product, type]);
}
