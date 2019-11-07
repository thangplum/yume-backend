import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { PostEntity } from '../post/post.entity';
import { PostService } from '../post/post.service';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, PostEntity, UserEntity])],
  providers: [CategoryService, CategoryResolver, PostService],
})
export class CategoryModule {}
