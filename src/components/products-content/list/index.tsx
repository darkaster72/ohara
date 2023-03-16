import { useAtomValue } from "jotai";
import { searchQueryAtom } from "~/store/atoms";
import { ProductTypeList } from "~/types";
import { api } from "~/utils/api";
import ProductItem from "../../product-item";
import ProductsLoading from "./loading";

const ProductsContent = () => {
  const search = useAtomValue(searchQueryAtom);
  const { error, data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.book.infiniteBooks.useInfiniteQuery(
      { search, limit: 20 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor?.valueOf() }
    );

  if (error) return <div>Failed to load users</div>;
  return (
    <>
      {!data && <ProductsLoading />}

      {data && (
        <section className="products-list">
          {data.pages
            .flatMap((p) => p.items)
            .map((item: ProductTypeList) => (
              <ProductItem {...item} key={item.id.toString()} />
            ))}
        </section>
      )}
      {!isFetchingNextPage && hasNextPage && (
        <button onClick={() => fetchNextPage()}>Load more</button>
      )}
    </>
  );
};

export default ProductsContent;
