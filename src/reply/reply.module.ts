import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../post/post.entity';
import { UserEntity } from '../user/user.entity';
import { ReplyEntity } from './reply.entity';
import { ReplyController } from './reply.controller';
import { ReplyResolver } from './reply.resolver';
import { CommentService } from '../comment/comment.service';
import { CommentEntity } from '../comment/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      UserEntity,
      ReplyEntity,
      CommentEntity,
    ]),
  ],
  providers: [ReplyService, ReplyResolver, CommentService],
  controllers: [ReplyController],
})
export class ReplyModule {}
