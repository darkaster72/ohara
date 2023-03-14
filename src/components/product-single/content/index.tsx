import Link from "next/link";
import { useState } from "react";
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
const productsColors: { id: string; label: string; color: string }[] = [];
const productsSizes: { id: string; label: string }[] = [];

const Content = ({ product }: ProductContent) => {
  const [count, setCount] = useState<number>(1);

  // const { favProducts } = useSelector((state: RootState) => state.user);
  // const isFavourite = some(
  //   favProducts,
  //   (productId) => productId === product.id
  // );

  const toggleFav = () => {
    // dispatch(
    //   toggleFavProduct({
    //     id: product.id,
    //   })
    // );
  };

  const addToCart = () => {
    // const productToSave: ProductStoreType = {
    //   id: product.id,
    //   name: product.name,
    //   thumb: product.images?.[0] ?? "",
    //   price: product.currentPrice,
    //   count: count,
    //   color: color,
    //   size: itemSize,
    // };
    // const productStore = {
    //   count,
    //   product: productToSave,
    // };
    // dispatch(addProduct(productStore));
  };

  const isFavourite = false;

  return (
    <section className="product-content">
      <div className="product-content__intro">
        {product.discount && <span className="product-on-sale">Sale</span>}
        <h2 className="product__name">{product.title}</h2>

        <div className="product__prices">
          <h4>₹{product.currentPrice as any}</h4>
          {product.discount && (
            <span className="line-through">${product.price as any}</span>
          )}
        </div>
      </div>

      <div className="product-content__filters">
        <div className="product-filter-item">
          <h5>
            ISBN: <strong>{product.isbn}</strong>
          </h5>
          <h5>
            No of Pages: <strong>{product.numPages}</strong>
          </h5>
          <h5>
            Publication Date:{" "}
            <strong>{product.publictionDate.toDateString()}</strong>
          </h5>
          <h5>
            Publisher:{" "}
            <strong>
              <Link
                className="hover:underline"
                href={"/publishers/" + product.publisherId}
              >
                {product.publisher.name}
              </Link>
            </strong>
          </h5>
          <h5>
            Author:{" "}
            <span className="">
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
                onClick={() => setCount(count - 1)}
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
            <button
              type="button"
              onClick={toggleFav}
              className={`btn-heart ${isFavourite ? "btn-heart--active" : ""}`}
            >
              <i className="icon-heart"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;
