import { type NextPage } from "next";
import { useRouter } from "next/router";
import ProductsCarousel from "~/components/products-featured/carousel";
import Layout from "~/layouts/Main";
import { api } from "~/utils/api";

interface Props {}

const PublisherPage: NextPage<Props> = () => {
  const { id } = useRouter().query;
  const { data: publisher } = api.publihser.getById.useQuery(+(id as string), {
    enabled: !!id,
  });
  const { data: products, isLoading } = api.book.getByPublisherId.useQuery(
    +(id as string),
    {
      enabled: !!id,
    }
  );
  return (
    <Layout>
      <div className="container">
        <h3 className="my-8 text-center text-3xl">
          Books by {publisher?.name}
        </h3>
        <div className="my-8 mx-16 flex flex-col gap-2">
          {products && <ProductsCarousel products={products} />}
          {isLoading && <p>Loading..</p>}
        </div>
      </div>
    </Layout>
  );
};

export default PublisherPage;
