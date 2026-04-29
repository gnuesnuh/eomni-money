import { Module } from "@nestjs/common";
import { NewsModule } from "../news/news.module";
import { DevController } from "./dev.controller";

// 시드/백필/실험 라우트. 운영(NODE_ENV=production)에선 노출 X — 외부에서
// /api/dev/seed 같은 비싼/위험한 액션이 호출되지 않도록 보호.
// 강제로 켜고 싶을 땐 ENABLE_DEV_ENDPOINTS=true.
const isProd = process.env.NODE_ENV === "production";
const force = process.env.ENABLE_DEV_ENDPOINTS === "true";
const enabled = !isProd || force;

@Module({
  imports: enabled ? [NewsModule] : [],
  controllers: enabled ? [DevController] : [],
})
export class DevModule {}
