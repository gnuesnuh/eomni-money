import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import { StocksService } from "./stocks.service";

@Controller("stocks")
export class StocksController {
  constructor(private readonly stocks: StocksService) {}

  @Get()
  list(@Query("badge") badge?: string) {
    return this.stocks.findAll(badge);
  }

  @Get(":ticker")
  detail(@Param("ticker") ticker: string) {
    return this.stocks.findOne(ticker);
  }

  @Get(":ticker/news")
  news(@Param("ticker") ticker: string) {
    return this.stocks.recentNews(ticker);
  }

  @Get(":ticker/explain")
  explain(
    @Param("ticker") ticker: string,
    @Query("direction") direction?: "up" | "down",
  ) {
    return this.stocks.explainPrice(ticker, direction);
  }

  @Post(":ticker/watch")
  watch(@Param("ticker") ticker: string) {
    return this.stocks.addToWatchlist(ticker);
  }
}
