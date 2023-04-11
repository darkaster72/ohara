import Image from "next/image";
import Link from "next/link";
import { useImage } from "~/hooks/useImage";
import { usePrice } from "~/hooks/usePrice";
import { type ProductTypeList } from "~/types";

const ProductItem = (item: ProductTypeList) => {
  const { id, title } = item;
  const { discount, isDiscounted, formattedPrice, originalPrice } =
    usePrice(item);
  const image = useImage(item, "card");
  return (
    <Link href={`/products/${id}`} className="product-item">
      <div className="product__image">
        <Image src={image} alt={item.title ?? ""} fill />
        {isDiscounted && (
          <span className="product__discount">
            {discount.round().toNumber()}% Off
          </span>
        )}
      </div>

      <div className="product__description">
        <h3>{title}</h3>
        <div
          className={
            "product__price " + (discount ? "product__price--discount" : "")
          }
        >
          <h4>{formattedPrice}</h4>

          {discount && <span className="line-through">{originalPrice}</span>}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
