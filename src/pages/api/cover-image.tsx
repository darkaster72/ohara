import { ImageResponse, type NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title")?.slice(0, 100) ?? "";
  const author = searchParams.get("author");
  const publisher = searchParams.get("publisher");
  const cardType = searchParams.get("type") === "card";

  return new ImageResponse(
    (
      <div tw="flex bg-gray-50 items-center w-screen  h-screen rounded-lg">
        <div tw="flex flex-col items-center justify-center p-16">
          <h1 tw="md:text-5xl text-3xl text-slate-700 text-center">{title}</h1>
          <p tw="text-lg text-gray-600">{author}</p>
          <p tw="text-gray-600">{publisher}</p>
        </div>
      </div>
    ),
    {
      width: cardType ? 280 : 600,
      height: cardType ? 385 : 530,
    }
  );
}
