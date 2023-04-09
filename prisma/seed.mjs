import { PrismaClient } from "@prisma/client";
import _ from "lodash";
import { DateTime } from "luxon";
import books from "./data.json" assert { type: "json" };
const prisma = new PrismaClient();

// @ts-ignore
const generateRandom = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const generatePrice = () => {
  const price = generateRandom(300, 1000);
  const discount = generateRandom(0, 25);

  return { currentPrice: price - discount, discount, price };
};

const load = async () => {
  try {
    await prisma.book.deleteMany();
    console.log("Deleted records in book table");
    await prisma.author.deleteMany();
    console.log("Deleted records in author table");
    await prisma.publisher.deleteMany();
    console.log("Deleted records in publisher table");

    // @ts-ignore
    const authors = _.uniq(books.flatMap((book) => book.authors.split("/")));
    // @ts-ignore
    const publishers = _.uniq(books.map((book) => book.publisher));
    await prisma.publisher.createMany({
      data: publishers.map((p) => ({ name: p })),
    });
    await prisma.author.createMany({ data: authors.map((a) => ({ name: a })) });

    // @ts-ignore
    books.forEach(async (book) => {
      const authors = book.authors.split("/");
      const { currentPrice, discount, price } = generatePrice();

      try {
        await prisma.book.create({
          data: {
            title: book.title,
            isbn: book.isbn,
            averageRating: book.average_rating,
            currentPrice,
            price,
            discount,
            isbn13: book.isbn13,
            languageCode: book.language_code,
            numPages: parseInt(book.num_pages),
            publictionDate: DateTime.fromFormat(
              book.publication_date,
              "m/d/yyyy"
            ).toJSDate(),
            quantityAvailable: 10,
            publisher: {
              connect: { name: book.publisher },
            },
            authors: {
              connect: authors
                // @ts-ignore
                .map((author) => ({
                  name: author,
                }))
                // @ts-ignore
                .reduce((acc, curr, i) => (acc[i] = curr), {}),
            },
          },
        });
      } catch (e) {
        console.log("Error adding record: ", book.title);
        console.log(e);
      }
    });

    console.log("Added book data");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};
load();
