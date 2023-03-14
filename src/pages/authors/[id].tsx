import { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

interface Props {}

const AuthorPage: NextPage<Props> = () => {
  const { id } = useRouter().query;
  const { data } = api.book.getByAuthor.useQuery(id as string, {
    enabled: !!id,
  });
  return (
    <div className="container">
      <h3 className="">Books by Author</h3>
      <div className="flex-con flex gap-2">{data?.map((b) => b.title)}</div>
    </div>
  );
};

export default AuthorPage;
