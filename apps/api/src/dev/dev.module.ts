import { Module } from "@nestjs/common";
import { NewsModule } from "../news/news.module";
import { DevController } from "./dev.controller";

@Module({
  imports: [NewsModule],
  controllers: [DevController],
})
export class DevModule {}
