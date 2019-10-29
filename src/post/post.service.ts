import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostDTO } from './post.dto';
import { UserEntity } from '../user/user.entity';
import { isDeclaration } from '@babel/types';
import { PostResponseDTO } from './post-response.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(post: PostEntity): PostResponseDTO {
    const responseObject: any = {
      ...post,
      author: post.author.toResponseObject(false),
    };
    if (responseObject.likes) {
      responseObject.likes = post.likes.length;
    }
    return responseObject;
  }

  private ensureOwnership(post: PostEntity, userId: string) {
    if (post.author.id !== userId) {
      throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
    }
  }

  async showAll(
    page: number = 1,
    newest?: boolean,
  ): Promise<PostResponseDTO[]> {
    const posts = await this.postRepository.find({
      relations: ['author', 'likes', 'replies'],
      take: 25,
      skip: 25 * (page - 1),
      order: newest && { created: 'DESC' },
    });
    return posts.map(post => this.toResponseObject(post));
  }

  async create(userId: string, data: PostDTO): Promise<PostResponseDTO> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const post = await this.postRepository.create({ ...data, author: user });
    await this.postRepository.save(post);
    return this.toResponseObject(post);
  }

  async show(id: string): Promise<PostResponseDTO> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'likes', 'replies'],
    });
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(post);
  }

  async update(
    id: string,
    userId: string,
    data: Partial<PostDTO>,
  ): Promise<PostResponseDTO> {
    let post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(post, userId);
    await this.postRepository.update({ id }, data);
    post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'replies'],
    });
    return this.toResponseObject(post);
  }

  async delete(id: string, userId: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'replies'],
    });
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(post, userId);
    await this.postRepository.delete({ id });
    return this.toResponseObject(post);
  }

  async like(id: string, userId: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'likes', 'replies'],
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (post.likes.filter(liker => liker.id === user.id).length > 0) {
      post.likes = post.likes.filter(liker => liker.id !== user.id);
    } else {
      post.likes.push(user);
    }
    await this.postRepository.save(post);
    return this.toResponseObject(post);
  }

  async bookmark(id: string, userId: string) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.bookmarks.filter(bookmark => bookmark.id === post.id).length < 1) {
      user.bookmarks.push(post);
      await this.userRepository.save(user);
    } else {
      throw new HttpException(
        'Idea already bookmarked',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject();
  }

  async unBookmark(id: string, userId: string) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.bookmarks.filter(bookmark => bookmark.id === post.id).length > 0) {
      user.bookmarks = user.bookmarks.filter(
        bookmark => bookmark.id !== post.id,
      );
      await this.userRepository.save(user);
    } else {
      throw new HttpException('Idea not bookmarked', HttpStatus.BAD_REQUEST);
    }
    return user.toResponseObject();
  }
}
