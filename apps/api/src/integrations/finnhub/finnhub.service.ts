import {
  HttpException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type {
  FinnhubCompanyNews,
  FinnhubNewsSentiment,
  FinnhubQuote,
} from "./finnhub.types";

const BASE_URL = "https://finnhub.io/api/v1";

@Injectable()
export class FinnhubService {
  private readonly logger = new Logger(FinnhubService.name);

  constructor(private readonly config: ConfigService) {}

  private get token(): string {
    const t = this.config.get<string>("FINNHUB_API_KEY");
    if (!t) {
      throw new ServiceUnavailableException(
        "FINNHUB_API_KEY is not configured. Get one at https://finnhub.io",
      );
    }
    return t;
  }

  private async fetchJson<T>(path: string, params: Record<string, string>): Promise<T> {
    const url = new URL(`${BASE_URL}${path}`);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    url.searchParams.set("token", this.token);

    const res = await fetch(url.toString());
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      this.logger.error(`Finnhub ${path} ${res.status}: ${body.slice(0, 200)}`);
      throw new HttpException(
        `Finnhub upstream error: ${res.status}`,
        res.status === 429 ? 429 : 502,
      );
    }
    return res.json() as Promise<T>;
  }

  async getQuote(symbol: string): Promise<FinnhubQuote> {
    return this.fetchJson<FinnhubQuote>("/quote", { symbol: symbol.toUpperCase() });
  }

  async getCompanyNews(
    symbol: string,
    options: { from?: Date; to?: Date; days?: number } = {},
  ): Promise<FinnhubCompanyNews[]> {
    const to = options.to ?? new Date();
    const from =
      options.from ??
      new Date(to.getTime() - (options.days ?? 7) * 24 * 60 * 60 * 1000);
    return this.fetchJson<FinnhubCompanyNews[]>("/company-news", {
      symbol: symbol.toUpperCase(),
      from: toISODate(from),
      to: toISODate(to),
    });
  }

  async getNewsSentiment(symbol: string): Promise<FinnhubNewsSentiment> {
    return this.fetchJson<FinnhubNewsSentiment>("/news-sentiment", {
      symbol: symbol.toUpperCase(),
    });
  }
}

function toISODate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}
