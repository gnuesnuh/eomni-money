import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { NewsService } from "./news.service";
import { ExplainDto } from "./dto/explain.dto";

@Controller("news")
export class NewsController {
  constructor(private readonly news: NewsService) {}

  @Get()
  list(@Query("filter") filter?: string) {
    return this.news.findFeed(filter);
  }

  @Get(":id")
  detail(@Param("id") id: string) {
    return this.news.findOne(id);
  }

  @Post(":id/explain")
  explain(@Param("id") id: string, @Body() dto: ExplainDto) {
    return this.news.explain(id, dto);
  }
}
