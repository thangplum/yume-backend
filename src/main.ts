import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as sslRootCAs from 'ssl-root-cas';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
// require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();

// require('ssl-root-cas/latest').inject();

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // { cors: true }
  );
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(4000);
}
bootstrap();
