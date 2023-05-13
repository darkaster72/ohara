/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { DateTime } from "luxon";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "~/hooks/useCart";
import { usePrice } from "~/hooks/usePrice";
import { type IProduct } from "~/types";

type ProductContent = {
  product: IProduct;
};

const Content = ({ product }: ProductContent) => {
  const { updateCartItem, getItem } = useCart();
  const { status } = useSession();
  const addToCart = () => {
    if (status === "unauthenticated") {
      void signIn();
    }
    updateCartItem(product.id, quantity, {
      onSuccess: () => toast.success("Added to cart"),
      onError: (error) => toast.error(error.message),
    });
  };
  const { formattedPrice, isDiscounted, originalPrice } = usePrice(product);
  const cartItem = getItem(product.id);
  const [quantity, setQuantity] = useState(cartItem?.quantity ?? 1);
  const outOfStock = !product.quantityAvailable;

  return (
    <section className="product-content">
      <div className="product-content__intro">
        {product.discount && <span className="product-on-sale">Sale</span>}
        <h2 className="product__name">{product.title}</h2>

        <div className="product__prices">
          <h4>{formattedPrice}</h4>
          {isDiscounted && (
            <span className="line-through">{originalPrice}</span>
          )}
        </div>
      </div>

      <div className="product-content__filters">
        <div className="product-filter-item">
          <h5>
            ISBN-10: <strong>{product.isbn}</strong>
          </h5>
          <h5>
            ISBN-13: <strong>{product.isbn13}</strong>
          </h5>
          <h5>
            No of Pages: <strong>{product.numPages}</strong>
          </h5>
          <h5>
            Language: <strong>{product.languageCode}</strong>
          </h5>
          <h5>
            Publication Date:{" "}
            <strong>
              {DateTime.fromJSDate(product.publictionDate).toFormat(
                "d MMM yyyy"
              )}
            </strong>
          </h5>
          <h5>
            Publisher:{" "}
            <Link
              className="text-blue-500 hover:underline"
              href={"/publishers/" + product.publisherId}
            >
              {product.publisher.name}
            </Link>
          </h5>
          <h5>
            Author:{" "}
            <span className="text-blue-500">
              {product.authors.map((author) => (
                <Link
                  key={author.id}
                  className="pr-1 after:content-[','] hover:underline"
                  href={"/authors/" + author.id}
                >
                  {author.name}
                </Link>
              ))}
            </span>
          </h5>
        </div>
        {!outOfStock && (
          <div className="product-filter-item">
            <h5>Quantity:</h5>
            <div className="quantity-buttons">
              <div className="quantity-button">
                <button
                  type="button"
                  disabled={quantity === 0}
                  onClick={() => setQuantity((i) => i - 1)}
                  className="quantity-button__btn"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((i) => i + 1)}
                  className="quantity-button__btn"
                >
                  +
                </button>
              </div>

              <button
                type="submit"
                onClick={() => addToCart()}
                className="btn btn--rounded btn--yellow"
              >
                Add to cart
              </button>
            </div>
          </div>
        )}
        {outOfStock && (
          <p className="text-red-500">Sorry product out of Stock!</p>
        )}
      </div>
    </section>
  );
};

export default Content;
