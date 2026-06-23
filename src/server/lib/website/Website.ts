export class Website {
  private readonly url: string;

  private constructor(url: string) {
    this.url = url;
  }

  static open(url: string): Website {
    return new Website(url);
  }

  async getContent(): Promise<string> {
    const response = await fetch("https://api.zyte.com/v1/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${process.env.ZYTE_API_KEY}:`).toString("base64")}`,
      },
      body: JSON.stringify({
        url: this.url,
        httpResponseBody: true,
        followRedirect: true,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Zyte extract failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const html = Buffer.from(data.httpResponseBody, "base64").toString("utf-8");

    return Website.stripAttributes(
      Website.stripTags(html, ["script", "style"]),
    );
  }

  // Removes the given tags and their content entirely (e.g. <script>...</script>).
  static stripTags(html: string, tags: string[]): string {
    return tags.reduce(
      (result, tag) =>
        result.replace(
          new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi"),
          "",
        ),
      html,
    );
  }

  // Removes all attributes from all remaining tags, e.g. `<div class="x">` -> `<div>`.
  static stripAttributes(html: string): string {
    return html.replace(/<([a-z0-9]+)(\s+[^>]*)?(\/?)>/gi, "<$1$3>");
  }
}
