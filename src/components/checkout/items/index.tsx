import { useCart } from "~/hooks/useCart";
import { usePrice } from "~/hooks/usePrice";
import { ICartItem } from "~/server/api/routers/cartRouter";

const CheckoutItems = () => {
  const { cart } = useCart();
  return (
    <ul className="checkout-items">
      {cart?.cartItems.map((item) => (
        <CheckoutItem item={item} key={item.id} />
      ))}
    </ul>
  );
};

export default CheckoutItems;

function CheckoutItem({ item }: { item: ICartItem }) {
  const { formattedPrice } = usePrice(item.book.currentPrice);
  return (
    <li className="checkout-item">
      <div className="checkout-item__content">
        <div className="checkout-item__img">
          <img src="" />
        </div>

        <div className="checkout-item__data">
          <h3>{item.book.title}</h3>
          <span>#{item.id}</span>
        </div>
      </div>
      <h3>{formattedPrice}</h3>
    </li>
  );
}
