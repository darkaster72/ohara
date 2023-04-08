import { ImageResponse, NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title")?.slice(0, 100) ?? "";
  const author = searchParams.get("author");
  const publisher = searchParams.get("publisher");
  console.log("==============================");
  console.log(title, author, publisher);

  return new ImageResponse(
    (
      <div tw="flex bg-gray-50 items-center w-screen  h-screen rounded-lg">
        <div tw="flex flex-col items-center justify-center p-16">
          <h1 tw="text-5xl text-slate-700 text-center">{title}</h1>
          <p tw="text-lg text-gray-600">{author}</p>
          <p tw="text-gray-600">{publisher}</p>
        </div>
      </div>
    ),
    {
      width: 600,
      height: 530,
    }
  );
}
