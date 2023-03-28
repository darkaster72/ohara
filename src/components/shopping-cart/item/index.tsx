import { useCart } from "~/hooks/useCart";
import { usePrice } from "~/hooks/usePrice";
import { ICartItem } from "~/server/api/routers/cartRouter";

const ShoppingCartItem = ({ book, quantity }: ICartItem) => {
  const { updateCartItem, removeCartItem } = useCart();
  const { formattedPrice } = usePrice(book);

  return (
    <tr>
      <td>
        <div className="cart-product">
          <div className="cart-product__img">
            <img src="" alt="" />
          </div>

          <div className="cart-product__content">
            <h3>{book.title}</h3>
            <p>#{book.id}</p>
          </div>
        </div>
      </td>
      <td>
        <div className="quantity-button">
          <button
            type="button"
            onClick={() => updateCartItem(book.id, quantity - 1)}
            className="quantity-button__btn"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            onClick={() => updateCartItem(book.id, quantity + 1)}
            className="quantity-button__btn"
          >
            +
          </button>
        </div>
      </td>
      <td>{formattedPrice}</td>
      <td className="cart-item-cancel">
        <i className="icon-cancel" onClick={() => removeCartItem(book.id)}></i>
      </td>
    </tr>
  );
};

export default ShoppingCartItem;
