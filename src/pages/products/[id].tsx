import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import Breadcrumb from "../../components/breadcrumb";
import Footer from "../../components/footer";
import Content from "../../components/product-single/content";
import Gallery from "../../components/product-single/gallery";
import ProductsFeatured from "../../components/products-featured";
import Layout from "../../layouts/Main";

// types

const Product = () => {
  const id = +(useRouter().query.id as string);
  const { data: product, isLoading } = api.book.getByBookId.useQuery(id, {
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
