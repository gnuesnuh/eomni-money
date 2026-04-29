import { join } from "node:path";
import * as dotenv from "dotenv";

// 셸에 이미 export된 빈 env var가 있으면 dotenv는 기본적으로 덮어쓰지 않음.
// 우리는 .env 가 우선이라 override:true로 먼저 로드한다.
dotenv.config({
  path: join(__dirname, "..", ".env"),
  override: true,
});
dotenv.config({
  path: join(__dirname, "..", ".env.local"),
  override: true,
});

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix("api");

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port, "0.0.0.0"); // Railway/컨테이너 환경에선 0.0.0.0 바인딩 필수
  // eslint-disable-next-line no-console
  console.log(`🚀 엄니머니 API listening on http://0.0.0.0:${port}/api`);
}

bootstrap();
