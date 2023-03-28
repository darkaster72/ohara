import { RouterOutputs } from "~/utils/api";

export type VotesType = {
  count: number;
  value: number;
};

export type PunctuationType = {
  countOpinions: number;
  punctuation: number;
  votes: VotesType[];
};

export type ReviewType = {
  name: string;
  avatar: string;
  description: string;
  punctuation: number;
};

export type ProductType = RouterOutputs["book"]["getByBookId"];
export type ProductTypeList = RouterOutputs["book"]["getAllBooks"][0];

export type ProductStoreType = {
  id: string;
  name: string;
  thumb: string;
  price: number;
  count: number;
  color: string;
  size: string;
};

export type GtagEventType = {
  action: string;
  category: string;
  label: string;
  value: string;
};

export type Cart = RouterOutputs["cart"]["getById"];
