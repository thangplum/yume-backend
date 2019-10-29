import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../post/post.entity';
import { UserEntity } from '../user/user.entity';
import { ReplyEntity } from './reply.entity';
import { ReplyController } from './reply.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity, ReplyEntity])],
  providers: [ReplyService],
  controllers: [ReplyController],
})
export class ReplyModule {}
