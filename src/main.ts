import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as sslRootCAs from 'ssl-root-cas';
import { ValidationPipe } from '@nestjs/common';

// require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();

// require('ssl-root-cas/latest').inject();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  await app.listen(3000);
}
bootstrap();
