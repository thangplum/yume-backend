import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyEntity } from '../reply/reply.entity';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from './comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReplyEntity, UserEntity, CommentEntity])],
  providers: [CommentService, CommentResolver],
})
export class CommentModule {}
