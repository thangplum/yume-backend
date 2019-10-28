import { Module, HttpModule } from '@nestjs/common';
import { DiscourseService } from './discourse.service';
import { DiscourseController } from './discourse.controller';
import { ConfigModule } from '../config/config.module';
import { CategoriesService } from './services/categories/categories.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [DiscourseService, CategoriesService],
  controllers: [DiscourseController],
  exports: [CategoriesService],
})
export class DiscourseModule {}
