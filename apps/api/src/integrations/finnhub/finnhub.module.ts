import { Global, Module } from "@nestjs/common";
import { FinnhubService } from "./finnhub.service";

@Global()
@Module({
  providers: [FinnhubService],
  exports: [FinnhubService],
})
export class FinnhubModule {}
