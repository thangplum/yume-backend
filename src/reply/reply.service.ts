import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReplyEntity } from './reply.entity';
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
    if (responseObject.upvotes) {
      responseObject.upvotes = responseObject.upvotes.map(voter => voter.id);
    }
    if (responseObject.downvotes) {
      responseObject.downvotes = responseObject.downvotes.map(
        voter => voter.id,
      );
    }
    if (responseObject.upvotes && responseObject.downvotes) {
      responseObject.rating = reply.upvotes.length - reply.downvotes.length;
    } else {
      responseObject.rating = 0;
    }
    if (responseObject.commentRaw) {
      responseObject.commentRaw = JSON.stringify(responseObject.commentRaw);
    }
    return responseObject;
  }

  async showByPost(postId: string, page: number = 1, limit: number = 25) {
    const replies = await this.replyRepository.find({
      where: { post: { id: postId } },
      relations: ['author', 'upvotes', 'downvotes'],
      take: limit,
      skip: limit * (page - 1),
      order: { created: 'DESC' },
    });
    return replies.map(reply => this.toResponseObject(reply));
  }

  async showByUser(userId: string, page: number = 1) {
    const replies = await this.replyRepository.find({
      where: { author: { id: userId } },
      relations: ['post', 'upvotes', 'downvotes'],
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
    const parsedRawComment = JSON.parse(data.commentRaw);
    const reply = await this.replyRepository.create({
      comment: data.comment,
      commentRaw: parsedRawComment,
      post,
      author: user,
    });
    await this.replyRepository.save(reply);
    return this.toResponseObject(reply);
  }

  async show(id: string) {
    const reply = await this.replyRepository.findOne({
      where: { id },
      relations: ['author', 'post', 'upvotes', 'downvotes'],
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
    await this.replyRepository.delete({ id });
    return this.toResponseObject(reply);
  }

  async upvote(id: string, userId: string) {
    const reply = await this.replyRepository.findOne({
      where: { id },
      relations: ['author', 'post', 'upvotes', 'downvotes', 'comments'],
    });
    if (!reply) {
      throw new HttpException('Reply not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // check if reply is already downvoted
    if (reply.downvotes.filter(voter => voter.id === user.id).length > 0) {
      // if already downvoted, then remove downvote
      reply.downvotes = reply.downvotes.filter(voter => voter.id !== user.id);
    }
    // check if reply is already upvoted, and only upvote if not
    if (reply.upvotes.filter(voter => voter.id === user.id).length === 0) {
      reply.upvotes.push(user);
    } else {
      reply.upvotes = reply.upvotes.filter(voter => voter.id !== user.id);
    }

    await this.replyRepository.save(reply);
    return this.toResponseObject(reply);
  }

  async downvote(id: string, userId: string) {
    const reply = await this.replyRepository.findOne({
      where: { id },
      relations: ['author', 'post', 'upvotes', 'downvotes', 'comments'],
    });
    if (!reply) {
      throw new HttpException('Reply not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // check if reply is already upvoted
    if (reply.upvotes.filter(voter => voter.id === user.id).length > 0) {
      // if upvoted remove the upvote
      reply.upvotes = reply.upvotes.filter(voter => voter.id !== user.id);
    }

    // check if reply is already downvoted, and only upvote if not
    if (reply.downvotes.filter(voter => voter.id === user.id).length === 0) {
      reply.downvotes.push(user);
    } else {
      reply.downvotes = reply.downvotes.filter(voter => voter.id !== user.id);
    }
    await this.replyRepository.save(reply);
    return this.toResponseObject(reply);
  }
}
