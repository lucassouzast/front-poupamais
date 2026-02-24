export type Entry = {
  _id: string;
  description?: string;
  value: number;
  date: string;
  category: string | { _id: string; title?: string };
  user: string;
  createdAt?: string;
  updatedAt?: string;
};
