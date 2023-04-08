import { useMemo } from "react";
import { IProduct } from "~/types";

type ImageProps = Pick<IProduct, "title"> &
  Partial<Pick<IProduct, "authors" | "publisher">>;
export function useImage(product?: ImageProps) {
  return useMemo(() => {
    if (!product) return "";
    const title = encodeURIComponent(product.title ?? "");
    return `/api/cover-image?title=${title}&author=${
      product.authors?.[0]?.name ?? ""
    }&publisher=${product.publisher?.name ?? ""}`;
  }, [product]);
}
