import Link from "next/link";
import { ProductTypeList } from "~/types";

const ProductItem = ({
  discount,
  id,
  title,
  price,
  currentPrice,
}: ProductTypeList) => {
  // const dispatch = useDispatch();
  // const { favProducts } = useSelector((state: RootState) => state.user);

  // const isFavourite = some(favProducts, (productId) => productId === id);
  const isFavourite = false;

  const toggleFav = () => {
    // dispatch(
    //   toggleFavProduct({
    //     id,
    //   })
    // );
  };

  return (
    <div className="product-item">
      <div className="product__image">
        <button
          type="button"
          onClick={toggleFav}
          className={`btn-heart ${isFavourite ? "btn-heart--active" : ""}`}
        >
          <i className="icon-heart"></i>
        </button>

        {/* <Link href={`/product/${id}`}>
          <img src={images ? images[0] : ""} alt="product" />
          {discount && <span className="product__discount">{discount}%</span>}
        </Link> */}
      </div>

      <div className="product__description">
        <Link href={`/products/${id}`}>
          <h3>{title}</h3>
        </Link>
        <div
          className={
            "product__price " + (discount ? "product__price--discount" : "")
          }
        >
          <h4>₹{currentPrice as any}</h4>

          {discount && <span className="line-through">₹{price as any}</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
