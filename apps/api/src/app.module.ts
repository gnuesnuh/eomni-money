import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { HealthController } from "./health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { NewsModule } from "./news/news.module";
import { StocksModule } from "./stocks/stocks.module";
import { UsersModule } from "./users/users.module";
import { StudyModule } from "./study/study.module";
import { BatchModule } from "./batch/batch.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    NewsModule,
    StocksModule,
    UsersModule,
    StudyModule,
    BatchModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
