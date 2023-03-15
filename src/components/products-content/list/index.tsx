import { useAtomValue } from "jotai";
import { searchQueryAtom } from "~/store/atoms";
import { ProductTypeList } from "~/types";
import { api } from "~/utils/api";
import ProductItem from "../../product-item";
import ProductsLoading from "./loading";

const ProductsContent = () => {
  const searchQuery = useAtomValue(searchQueryAtom);
  const { error, data } = api.book.getAll.useQuery(searchQuery);

  if (error) return <div>Failed to load users</div>;
  return (
    <>
      {!data && <ProductsLoading />}

      {data && (
        <section className="products-list">
          {data.map((item: ProductTypeList) => (
            <ProductItem {...item} key={item.id} />
          ))}
        </section>
      )}
    </>
  );
};

export default ProductsContent;
