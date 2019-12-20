import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FlagEntity } from './flag.entity';
import { Repository } from 'typeorm';
import { PostEntity } from '../post/post.entity';
import { UserEntity, UserPermissions } from '../user/user.entity';

@Injectable()
export class FlagService {
  constructor(
    @InjectRepository(FlagEntity)
    private readonly flagRepository: Repository<FlagEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async showAll(userId: string) {
    const flags = await this.flagRepository.find({
      relations: ['post', 'author'],
    });
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if (!user.permission || user.permission !== UserPermissions.ADMIN) {
      throw new HttpException('Not an admin', HttpStatus.BAD_REQUEST);
    }
    return flags;
  }

  async create(postId: string, reason: string, userId: string) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new HttpException('Error post not found', HttpStatus.BAD_REQUEST);
    }
    const flag = await this.flagRepository.find({
      where: {
        post: postId,
        author: userId,
      },
    });
    if (flag.length) {
      // already flagged before
      throw new HttpException(
        'Post already flagged before',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const newFlag = await this.flagRepository.create({
      author: user,
      post,
      reason,
    });
    await this.flagRepository.save(newFlag);
    return newFlag;
  }
}
