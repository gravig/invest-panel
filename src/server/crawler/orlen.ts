import * as cheerio from "cheerio";
import { NewsService } from "../services/news.service";

class Stream<T> {
  readonly batchSize: number;
  private listeners: ((data: T[]) => void)[];

  constructor(batchSize: number) {
    this.batchSize = batchSize;
    this.listeners = [];
  }

  push(data: T[]) {
    for (const listener of this.listeners) {
      listener(data);
    }
  }

  onData(listener: (data: T[]) => void) {
    this.listeners.push(listener);
  }
}

export interface OrlenReport {
  title: string;
  date: string;
  url: string;
  content?: string;
}

export interface OrlenReportPage {
  page: number;
  count: number;
  reports: OrlenReport[];
}

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.8",
};

type Settings = {
  page: {
    from: number;
    to: number;
  };
};

export const orlen = (settings: Settings): Stream<OrlenReport> => {
  const stream = new Stream<OrlenReport>(10);
  const { from: fromPage, to: toPage } = settings.page;

  const index = async (page: number = 1): Promise<OrlenReportPage> => {
    const url = `https://www.orlen.pl/pl/relacje-inwestorskie/raporty-i-publikacje/raporty-biezace?page=${page}`;
    const response = await fetch(url, { headers });
    const html = await response.text();
    const $ = cheerio.load(html);

    const reports: OrlenReport[] = $(".cmp-report-list__item")
      .map((_, item) => {
        const title = $(item).find(".cmp-report-list__title").text().trim();
        const url = $(item).find(".cmp-report-list__link").attr("href") || "";
        const date = $(item)
          .find(".cmp-report-list__publicationDate")
          .text()
          .trim();
        return { title, date, url: `https://www.orlen.pl${url}` };
      })
      .get();

    return { page, count: reports.length, reports };
  };

  const page = async (url: string) => {
    const response = await fetch(url, { headers });
    const html = await response.text();
    const $ = cheerio.load(html);
    const content = $("#main-container.cmp-container").text().trim();

    return content.replace(/\s+/g, " ").trim();
  };

  (async () => {
    const pages: OrlenReportPage[] = [];

    for (let page = fromPage; page <= toPage; page++) {
      console.log(`Indexing articles ${page}...`);
      const data = await index(page);
      if (data.count === 0) break;
      pages.push(data);
    }

    const allReports = pages.flatMap((page) => page.reports);

    const existing = await NewsService.findExistingTitleDates(
      allReports.map((report) => ({ title: report.title, date: report.date })),
    );
    const newReports = allReports.filter(
      (report) => !existing.has(`${report.title} ${report.date}`),
    );

    let batch: OrlenReport[] = [];

    for (const report of newReports) {
      console.log(`Fetching content for report: ${report.title}`);
      report.content = await page(report.url);
      batch.push(report);

      if (batch.length >= stream.batchSize) {
        stream.push(batch);
        batch = [];
      }
    }

    if (batch.length > 0) {
      stream.push(batch);
    }
  })();

  return stream;
};

orlen({ page: { from: 1, to: 186 } }).onData((reports) => {
  NewsService.createMany(
    reports.map((report) => ({
      title: report.title,
      description: report.content,
      date: report.date,
      url: report.url,
    })),
  );
});
