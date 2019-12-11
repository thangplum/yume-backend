import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Repository, LessThan, MoreThan, FindOperator } from 'typeorm';
import { PostEntity } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostDTO } from './post.dto';
import { UserEntity } from '../user/user.entity';
import { PostResponseDTO } from './post-response.dto';
import { CategoryEntity } from '../category/category.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
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

  async showAll(page: number = 1, limit: number = 25, newest?: boolean) {
    const postCount = await this.postRepository.count();
    const pages = Math.ceil(postCount / limit);
    const posts = await this.postRepository.find({
      relations: ['author', 'likes', 'replies', 'category'],
      take: limit,
      skip: limit * (page - 1),
      order: newest && { created: 'DESC' },
    });
    return {
      pages,
      nodes: posts.map(post => this.toResponseObject(post)),
    };
  }

  async showPostConnection(
    first?: number,
    after?: string,
    last?: number,
    before?: string,
    category?: string,
  ) {
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (!first && !last) {
      first = 10;
    }
    // posts are displayed newest to oldest
    // before is newer posts (created > cursor)
    if (before) {
      before = new Date(Number(before)).toUTCString();
      where.created = MoreThan(before);
    }

    // after is older posts (created < cursor)
    if (after) {
      after = new Date(Number(after)).toUTCString();
      where.created = LessThan(after);
    }

    const posts = await this.postRepository.find({
      where,
      order: { created: 'DESC' },
      take: first || last,
      relations: ['author', 'likes', 'replies', 'category'],
    });
    const edges = posts.map(post => ({
      node: post,
      cursor: post.created,
    }));

    const hasNextPage = async () => {
      if (posts.length < (last || first)) {
        return false;
      }
      const prev = posts[posts.length - 1].created;
      const post = await this.postRepository.findOne({
        where: {
          created: before ? MoreThan(prev) : LessThan(prev),
          order: { created: 'DESC' },
        },
      });
      return !!post;
    };

    const hasPreviousPage = async () => {
      if (posts.length === 0) {
        return false;
      }
      const post = await this.postRepository.findOne({
        where: {
          created: where.created,
          order: { created: 'ASC' },
        },
      });
      return !!post;
    };
    return {
      edges,
      pageInfo: {
        hasNextPage: await hasNextPage(),
        hasPreviousPage: await hasPreviousPage(),
      },
    };
  }

  async showByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 25,
    newest: boolean = true,
  ) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['children', 'parent'],
    });
    if (!category.parent) {
      // this is parent category
      // so get posts from all sub categories
      const where = category.children.map(child => {
        return { category: child.id };
      });
      const postCount = await this.postRepository.count({
        where,
      });
      const pages = Math.ceil(postCount / limit);
      const posts = await this.postRepository.find({
        where,
        relations: ['author', 'likes', 'replies'],
        take: limit,
        skip: limit * (page - 1),
        order: newest && { created: 'DESC' },
      });
      return {
        pages,
        nodes: posts.map(post => this.toResponseObject(post)),
      };
    } else {
      const postCount = await this.postRepository.count({
        where: { category: categoryId },
      });
      const pages = Math.ceil(postCount / limit);

      const posts = await this.postRepository.find({
        where: { category: categoryId },
        relations: ['author', 'likes', 'replies'],
        take: limit,
        skip: limit * (page - 1),
        order: newest && { created: 'DESC' },
      });
      return {
        pages,
        nodes: posts.map(post => this.toResponseObject(post)),
      };
    }
  }

  async create(
    userId: string,
    categoryId: string,
    data: PostDTO,
  ): Promise<PostResponseDTO> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const post = await this.postRepository.create({
      ...data,
      author: user,
      category,
    });
    await this.postRepository.save(post);
    return this.toResponseObject(post);
  }

  async show(id: string): Promise<PostResponseDTO> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'likes', 'replies', 'category'],
    });
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(post);
  }

  async showBySlug(slug: string): Promise<PostResponseDTO> {
    const post = await this.postRepository.findOne({
      where: { slug },
      relations: ['author', 'likes', 'category'],
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
