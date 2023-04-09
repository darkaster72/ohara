import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

interface Props {}

const PublisherPage: NextPage<Props> = () => {
  const { id } = useRouter().query;
  const { data } = api.book.getByPublisherId.useQuery(+(id as string), {
    enabled: !!id,
  });
  return (
    <div className="container">
      <h3 className="">Books by Publisher</h3>
      <div className="flex-con flex gap-2">{data?.map((b) => b.title)}</div>
    </div>
  );
};

export default PublisherPage;
