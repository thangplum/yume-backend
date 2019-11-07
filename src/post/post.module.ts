import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostEntity } from './post.entity';
import { UserEntity } from '../user/user.entity';
import { PostResolver } from './post.resolver';
import { ReplyEntity } from '../reply/reply.entity';
import { ReplyService } from '../reply/reply.service';
import { CategoryEntity } from '../category/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      UserEntity,
      ReplyEntity,
      CategoryEntity,
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, PostResolver, ReplyService],
  exports: [TypeOrmModule],
})
export class PostModule {}
