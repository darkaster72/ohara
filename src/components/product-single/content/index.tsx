import { DateTime } from "luxon";
import Link from "next/link";
import { useCart } from "~/hooks/useCart";
import { usePrice } from "~/hooks/usePrice";
import { ProductType } from "~/types";
// import productsColors from "~/utils/data/products-colors";

type ProductContent = {
  product: ProductType;
};
const productsTypes: {
  id: string;
  name: string;
  count: string;
}[] = [];
const Content = ({ product }: ProductContent) => {
  const { updateCartItem, cart } = useCart();
  const addToCart = () => {};
  const { formattedPrice, isDiscounted, originalPrice } = usePrice(
    product.currentPrice
  );

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
                  className="pr-1 after:content-[','] hover:underline"
                  href={"/authors/" + author.id}
                >
                  {author.name}
                </Link>
              ))}
            </span>
          </h5>
        </div>
        <div className="product-filter-item">
          <h5>Quantity:</h5>
          <div className="quantity-buttons">
            <div className="quantity-button">
              <button
                type="button"
                onClick={() => updateQuantity(count - 1)}
                className="quantity-button__btn"
              >
                -
              </button>
              <span>{count}</span>
              <button
                type="button"
                onClick={() => setCount(count + 1)}
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
      </div>
    </section>
  );
};

export default Content;
