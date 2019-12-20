import { Module } from '@nestjs/common';
import { FlagService } from './flag.service';
import { FlagResolver } from './flag.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlagEntity } from './flag.entity';
import { PostEntity } from '../post/post.entity';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FlagEntity, PostEntity, UserEntity])],
  providers: [FlagService, FlagResolver],
})
export class FlagModule {}
