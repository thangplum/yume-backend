import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscourseModule } from './discourse/discourse.module';
// import { ConfigService } from './config/config.service';
// import { ConfigModule } from './config/config.module';

@Module({
  imports: [DiscourseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
