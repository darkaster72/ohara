import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import ShippingAddress from "~/components/shipping-form";
import { useCart } from "~/hooks/useCart";
import { usePrice } from "~/hooks/usePrice";
import CheckoutStatus from "../../components/checkout-status";
import CheckoutItems from "../../components/checkout/items";
import Layout from "../../layouts/Main";

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, placeOrder } = useCart();
  const { formattedPrice } = usePrice(cart?.total);

  const onPlaceOrder = () => {
    if (!cart?.isValid) {
      toast.warning("Invalid Cart");
    }
    placeOrder({
      onSuccess: (p) => router.push(`/orders/${p.id}`),
      onError: (e) => toast.error(e.message),
    });
  };

  return (
    <Layout>
      <section className="cart">
        <div className="container">
          <div className="cart__intro">
            <CheckoutStatus step="checkout" />
          </div>

          <div className="checkout-content">
            <div className="checkout__col-6">
              <ShippingAddress />
            </div>

            <div className="checkout__col-4">
              <div className="block">
                <h3 className="block__title">Payment method</h3>
                <ul className="round-options">
                  <li className="round-item w-full">
                    <span>Pay on Delivery</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="checkout__col-2">
              <div className="block">
                <h3 className="block__title">Your cart</h3>
                <CheckoutItems />

                <div className="checkout-total">
                  <p>Total cost</p>
                  <h3>{formattedPrice}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-actions cart-actions--checkout">
            <a href="/cart" className="cart__btn-back">
              <i className="icon-left"></i> Back
            </a>
            <div className="cart-actions__items-wrapper">
              <Link href="/cart">
                <button type="button" className="btn btn--rounded btn--border">
                  Continue shopping
                </button>
              </Link>
              <button
                type="button"
                onClick={() => onPlaceOrder()}
                className="btn btn--rounded btn--yellow"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;
