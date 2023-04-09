import Link from "next/link";
import { api } from "~/utils/api";
import ProductsCarousel from "./carousel";

const ProductsFeatured = () => {
  const { data } = api.book.getAllBooks.useQuery();

  return (
    <section className="section section-products-featured">
      <div className="container">
        <header className="section-products-featured__header">
          <h3>Selected just for you</h3>
          <Link href="/products" className="btn btn--rounded btn--border">
            Show All
          </Link>
        </header>

        <ProductsCarousel products={data} />
      </div>
    </section>
  );
};

export default ProductsFeatured;
