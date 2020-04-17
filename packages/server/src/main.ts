import { NestFactory, } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { CustumValidationPipe } from './shared/validation';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { AppModule } from './app.module';
import config from "@crl/config";

async function bootstrap() {
  // APP
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // VALIDAZIONE 
  app.useGlobalPipes(CustumValidationPipe);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // REACT
  app.use(express.static(join(process.cwd(), '../web/build')));
  app.enableCors();
  // PORTA
  await app.listen(config.server.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();