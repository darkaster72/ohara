import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import Breadcrumb from "../../components/breadcrumb";
import Footer from "../../components/footer";
import Content from "../../components/product-single/content";
import Description from "../../components/product-single/description";
import Gallery from "../../components/product-single/gallery";
import ProductsFeatured from "../../components/products-featured";
import Layout from "../../layouts/Main";

// types

const Product = () => {
  const id = useRouter().query.id as string;
  const { data: product, isLoading } = api.book.getById.useQuery(id, {
    enabled: !!id,
  });
  const [showBlock, setShowBlock] = useState("description");

  return (
    <Layout>
      <Breadcrumb />
      <section className="product-single">
        <div className="container">
          <div className="product-single__content">
            <Gallery images={[]} />
            {product && <Content product={product} />}
          </div>

          <div className="product-single__info">
            <div className="product-single__info-btns">
              <button
                type="button"
                onClick={() => setShowBlock("description")}
                className={`btn btn--rounded ${
                  showBlock === "description" ? "btn--active" : ""
                }`}
              >
                Description
              </button>
              <button
                type="button"
                onClick={() => setShowBlock("reviews")}
                className={`btn btn--rounded ${
                  showBlock === "reviews" ? "btn--active" : ""
                }`}
              >
                Reviews (2)
              </button>
            </div>

            <Description show={showBlock === "description"} />
            {/* <Reviews product={product} show={showBlock === "reviews"} /> */}
          </div>
        </div>
      </section>

      <div className="product-single-page">
        <ProductsFeatured />
      </div>
      <Footer />
    </Layout>
  );
};

export default Product;
