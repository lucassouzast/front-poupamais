export type Entry = {
  _id: string;
  title: string;
  value: number;
  date: string;
  details: string;
  category: string | { _id: string; title?: string };
  user?: string;
  createdAt?: string;
  updatedAt?: string;
};
