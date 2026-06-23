import dotenv from "dotenv";
dotenv.config();
// https://newsdata.io/api/1/latest?
//   apikey=pub_9630256be72b4c9b9f24ff02dd4c6f7a
//   &country=pl

const baseUrl = "https://newsdata.io/api/1/latest";
const apiKey = process.env.NEWS_DATA_IO_API_KEY;
const url = `${baseUrl}?apikey=${apiKey}`;

export const fetchLatestNews = async (country: string) => {
  const _url = `${url}&country=${country}`;
  const response = await fetch(_url);
  return await response.json();
};
