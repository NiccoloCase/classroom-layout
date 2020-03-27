import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustumValidationPipe } from './shared/validation';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(CustumValidationPipe);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(5000);
}
bootstrap();
