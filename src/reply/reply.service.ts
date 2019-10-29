import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplyEntity } from './reply.entity';
import { Repository } from 'typeorm';
import { PostEntity } from '../post/post.entity';
import { UserEntity } from '../user/user.entity';
import { ReplyDTO } from './reply.dto';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(ReplyEntity)
    private readonly replyRepository: Repository<ReplyEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(reply: ReplyEntity) {
    const responseObject: any = reply;
    if (reply.author) {
      responseObject.author = reply.author.toResponseObject(false);
    }
    return responseObject;
  }

  async showByPost(postId: string, page: number = 1) {
    const replies = await this.replyRepository.find({
      where: { post: { id: postId } },
      relations: ['author'],
      take: 25,
      skip: 25 * (page - 1),
    });
    return replies.map(reply => this.toResponseObject(reply));
  }

  async showByUser(userId: string, page: number = 1) {
    const replies = await this.replyRepository.find({
      where: { author: { id: userId } },
      relations: ['post'],
      take: 25,
      skip: 25 * (page - 1),
    });
    return replies.map(reply => this.toResponseObject(reply));
  }

  async create(postId: string, userId: string, data: ReplyDTO) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const reply = await this.replyRepository.create({
      ...data,
      post,
      author: user,
    });
    await this.replyRepository.save(reply);
    return this.toResponseObject(reply);
  }

  async show(id: string) {
    const reply = await this.replyRepository.findOne({
      where: { id },
      relations: ['author', 'post'],
    });
    if (!reply) {
      throw new HttpException('Reply does not exist', HttpStatus.BAD_REQUEST);
    }
    return this.toResponseObject(reply);
  }

  async deleteReply(id: string, userId: string) {
    const reply = await this.replyRepository.findOne({
      where: { id },
      relations: ['author', 'post'],
    });
    if (!reply) {
      throw new HttpException('Reply does not exist', HttpStatus.BAD_REQUEST);
    }
    if (reply.author.id !== userId) {
      throw new HttpException(
        'User does not own reply',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.replyRepository.remove(reply);
    return this.toResponseObject(reply);
  }
}
