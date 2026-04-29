import { join } from "node:path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { HealthController } from "./health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { FinnhubModule } from "./integrations/finnhub/finnhub.module";
import { ClaudeModule } from "./integrations/claude/claude.module";
import { DevModule } from "./dev/dev.module";
import { NewsModule } from "./news/news.module";
import { StocksModule } from "./stocks/stocks.module";
import { UsersModule } from "./users/users.module";
import { StudyModule } from "./study/study.module";
import { BatchModule } from "./batch/batch.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // dist 또는 src 기준이 아닌, apps/api 루트의 .env 를 안정적으로 찾기 위해 절대 경로
      envFilePath: [
        join(__dirname, "..", ".env.local"),
        join(__dirname, "..", ".env"),
      ],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    FinnhubModule,
    ClaudeModule,
    DevModule,
    NewsModule,
    StocksModule,
    UsersModule,
    StudyModule,
    BatchModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
