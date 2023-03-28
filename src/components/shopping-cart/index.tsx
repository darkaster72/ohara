import { useCart } from "~/hooks/useCart";
import { usePrice } from "~/hooks/usePrice";
import CheckoutStatus from "../../components/checkout-status";
import Item from "./item";

const ShoppingCart = () => {
  const { cart, isLoading, isFetching } = useCart();
  const { formattedPrice } = usePrice(cart?.totalPrice);

  return (
    <section className="cart">
      <div className="container">
        <div className="cart__intro">
          <h3 className="cart__title">Shopping Cart</h3>
          <CheckoutStatus step="cart" />
        </div>

        <div className="cart-list">
          {cart && !cart.isEmpty && (
            <table>
              <tbody>
                <tr>
                  <th style={{ textAlign: "left" }}>Product</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Ammount</th>
                  <th>Price</th>
                  <th></th>
                </tr>

                {cart.cartItems.map((item) => (
                  <Item key={item.id} {...item} />
                ))}
              </tbody>
            </table>
          )}

          {cart?.isEmpty && <p>Nothing in the cart</p>}
        </div>

        <div className="cart-actions">
          <a href="/products" className="cart__btn-back">
            <i className="icon-left"></i> Continue Shopping
          </a>
          <input
            type="text"
            placeholder="Promo Code"
            className="cart__promo-code"
          />

          <div className="cart-actions__items-wrapper">
            <p className="cart-actions__total">
              Total cost <strong>{formattedPrice}</strong>
            </p>
            <a href="/cart/checkout" className="btn btn--rounded btn--yellow">
              Checkout
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;
