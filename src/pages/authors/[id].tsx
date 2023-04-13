import { type NextPage } from "next";
import { useRouter } from "next/router";
import ProductsCarousel from "~/components/products-featured/carousel";
import Layout from "~/layouts/Main";
import { api } from "~/utils/api";

interface Props {}

const AuthorPage: NextPage<Props> = () => {
  const { id } = useRouter().query;
  const { data: author } = api.author.getById.useQuery(+(id as string), {
    enabled: !!id,
  });
  const { data: products, isLoading } = api.book.getByAuthorId.useQuery(
    +(id as string),
    {
      enabled: !!id,
    }
  );

  return (
    <Layout>
      <div className="container">
        <h3 className="my-8 text-center text-3xl">Books by {author?.name}</h3>
        <div className="my-8 mx-16 flex flex-col gap-2">
          {products && <ProductsCarousel products={products} />}
          {isLoading && <p>Loading..</p>}
        </div>
      </div>
    </Layout>
  );
};

export default AuthorPage;
