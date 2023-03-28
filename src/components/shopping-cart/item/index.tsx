import { useCart } from "~/hooks/useCart";
import { usePrice } from "~/hooks/usePrice";
import { ICartItem } from "~/server/api/routers/cartRouter";

const ShoppingCartItem = ({ product, quantity }: ICartItem) => {
  const { updateCartItem, removeCartItem } = useCart();
  const { formattedPrice } = usePrice(product.currentPrice);

  return (
    <tr>
      <td>
        <div className="cart-product">
          <div className="cart-product__img">
            <img src="" alt="" />
          </div>

          <div className="cart-product__content">
            <h3>{product.title}</h3>
            <p>#{product.id}</p>
          </div>
        </div>
      </td>
      <td>
        <div className="quantity-button">
          <button
            type="button"
            onClick={() => updateCartItem(product.id, quantity + 1)}
            className="quantity-button__btn"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            onClick={() => updateCartItem(product.id, quantity - 1)}
            className="quantity-button__btn"
          >
            +
          </button>
        </div>
      </td>
      <td>{formattedPrice}</td>
      <td className="cart-item-cancel">
        <i
          className="icon-cancel"
          onClick={() => removeCartItem(product.id)}
        ></i>
      </td>
    </tr>
  );
};

export default ShoppingCartItem;
