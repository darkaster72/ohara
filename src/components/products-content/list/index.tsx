import { useAtomValue } from "jotai";
import { searchQueryAtom } from "~/atoms/searchAtom";
import { type ProductTypeList } from "~/types";
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
        <div className="flex justify-center">
          <button
            className="btn btn--rounded btn--border"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={() => fetchNextPage()}
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
};

export default ProductsContent;
