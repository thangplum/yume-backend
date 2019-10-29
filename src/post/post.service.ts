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

  private toResponseObject(post: PostEntity) {
    return { ...post, author: post.author.toResponseObject(false) };
  }

  private ensureOwnership(post: PostEntity, userId: string) {
    if (post.author.id !== userId) {
      throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
    }
  }

  async showAll(): Promise<PostResponseDTO[]> {
    const posts = await this.postRepository.find({ relations: ['author'] });
    return posts.map(post => this.toResponseObject(post));
  }

  async create(userId: string, data: PostDTO): Promise<PostResponseDTO> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const post = await this.postRepository.create({ ...data, author: user });
    await this.postRepository.save(post);
    return this.toResponseObject(post);
  }

  async show(id: string): Promise<PostResponseDTO> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
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
      relations: ['author'],
    });
    return this.toResponseObject(post);
  }

  async delete(id: string, userId: string) {
    const post = await this.postRepository.findOne({ where: { id }, relations: ['author'] });
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(post, userId);
    await this.postRepository.delete({ id });
    return this.toResponseObject(post);
  }
}
