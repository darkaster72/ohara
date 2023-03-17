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
    <Link href={`/products/${id}`} className="product-item">
      <div className="product__image">
        {/* <button
          type="button"
          onClick={toggleFav}
          className={`btn-heart ${isFavourite ? "btn-heart--active" : ""}`}
        >
          <i className="icon-heart"></i>
        </button> */}

        {/* <img src={images ? images[0] : ""} alt="product" /> */}
        {discount && <span className="product__discount">{discount}% Off</span>}
      </div>

      <div className="product__description">
        <h3>{title}</h3>
        <div
          className={
            "product__price " + (discount ? "product__price--discount" : "")
          }
        >
          <h4>₹{currentPrice as any}</h4>

          {discount && <span className="line-through">₹{price as any}</span>}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
