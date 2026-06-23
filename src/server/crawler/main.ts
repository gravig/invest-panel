import { fetchLatestNews } from "./newsdata";

const main = async () => {
  const news = await fetchLatestNews("pl");

  console.log(news);
};

main();
