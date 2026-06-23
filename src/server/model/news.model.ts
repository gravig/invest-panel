export interface NewsLabel {
  key: string;
  value: string;
}

export interface NewsModel {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  url: string;
  imageUrl: string | null;
  labels: NewsLabel[] | null;
  embedded: string | null;
  embedding: string | null;
  embeddingModel: string | null;
  createdAt: number;
  updatedAt: number;
}
