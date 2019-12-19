import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { ReplyEntity } from '../reply/reply.entity';
import { UserEntity } from '../user/user.entity';
import { CommentDTO } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepositorty: Repository<CommentEntity>,
    @InjectRepository(ReplyEntity)
    private readonly replyRepository: Repository<ReplyEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(comment: CommentEntity) {
    const responseObject: any = comment;
    if (comment.author) {
      responseObject.author = comment.author.toResponseObject(false);
    }
    if (responseObject.likes) {
      responseObject.numLikes = comment.likes.length;
      responseObject.likes = responseObject.likes.map(liker => liker.id);
    }
    return responseObject;
  }

  async showByReply(replyId: string, page: number = 1, limit: number = 10) {
    const comments = await this.commentRepositorty.find({
      where: { reply: { id: replyId } },
      relations: ['author', 'likes'],
      take: limit,
      skip: limit * (page - 1),
      order: { created: 'DESC' },
    });
    return comments.map(comment => this.toResponseObject(comment));
  }

  async showByUser(userId: string, page: number = 1) {
    const comments = await this.commentRepositorty.find({
      where: { author: { id: userId } },
      relations: ['reply', 'likes'],
      take: 25,
      skip: 25 * (page - 1),
    });
    return comments.map(comment => this.toResponseObject(comment));
  }

  async create(replyId: string, userId: string, data: CommentDTO) {
    const reply = await this.replyRepository.findOne({
      where: { id: replyId },
    });
    if (!reply) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const comment = await this.commentRepositorty.create({
      ...data,
      reply,
      author: user,
    });
    await this.commentRepositorty.save(comment);
    return this.toResponseObject(comment);
  }

  async show(commentId: string) {
    const comment = await this.commentRepositorty.findOne({
      where: { id: commentId },
      relations: ['author', 'reply', 'likes'],
    });
    if (!comment) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(comment);
  }

  async deleteComment(id: string, userId: string) {
    const comment = await this.commentRepositorty.findOne({
      where: { id },
      relations: ['author', 'reply'],
    });
    if (!comment) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    if (comment.author.id !== userId) {
      throw new HttpException(
        'User does not own comment',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.commentRepositorty.delete({ id });
    return this.toResponseObject(comment);
  }

  async like(id: string, userId: string) {
    const comment = await this.commentRepositorty.findOne({
      where: { id },
      relations: ['author', 'reply', 'likes'],
    });
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (comment.likes.filter(liker => liker.id === user.id).length > 0) {
      comment.likes = comment.likes.filter(liker => liker.id !== user.id);
    } else {
      comment.likes.push(user);
    }
    await this.commentRepositorty.save(comment);
    return this.toResponseObject(comment);
  }
}
