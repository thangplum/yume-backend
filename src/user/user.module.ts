import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { PostEntity } from '../post/post.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserResolver } from './user.resolver';
import { ReplyEntity } from '../reply/reply.entity';
import { ReplyService } from '../reply/reply.service';
import { PostService } from '../post/post.service';
import { CategoryEntity } from '../category/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PostEntity,
      ReplyEntity,
      CategoryEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    UserResolver,
    ReplyService,
    PostService,
  ],
  exports: [UserService],
})
export class UserModule {}
