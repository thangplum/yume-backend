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
    };
    if (responseObject.author) {
      responseObject.author = post.author.toResponseObject(false);
    }
    if (responseObject.upvotes) {
      responseObject.upvotes = responseObject.upvotes.map(
        (voter: UserEntity) => voter.id,
      );
    }
    if (responseObject.downvotes) {
      responseObject.downvotes = responseObject.downvotes.map(
        (voter: UserEntity) => voter.id,
      );
    }
    if (responseObject.upvotes && responseObject.downvotes) {
      responseObject.rating = post.upvotes.length - post.downvotes.length;
    } else {
      responseObject.rating = 0;
    }
    if (responseObject.commentRaw) {
      responseObject.commentRaw = JSON.stringify(responseObject.commentRaw);
    }
    return responseObject;
  }

  private ensureOwnership(post: PostEntity, userId: string) {
    if (post.author.id !== userId) {
      throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
    }
  }

  async searchInPost(query: string, page: number = 1, limit: number = 10) {
    if (limit < 0 || page < 1) {
      throw new HttpException(
        'Bad values for page/limit',
        HttpStatus.BAD_REQUEST,
      );
    }

    const queryString = `
      SELECT * FROM post
        WHERE to_tsvector(post.caption) @@ plainto_tsquery($1)
          OR to_tsvector(post.comment) @@ plainto_tsquery($2)
          ORDER BY post.created DESC, post.id ASC
          LIMIT 100`;
    //       LIMIT ${limit}
    //       OFFSET ${limit * (page - 1)}
    // `;

    const posts = await this.postRepository.query(queryString, [query, query]);
    const pages = Math.ceil(posts.length / limit);
    const postIds = posts.map(post => {
      return { id: post.id };
    });

    if (!postIds.length) {
      return {
        pages: 0,
        nodes: [],
      };
    }

    const allPosts = await this.postRepository.find({
      relations: ['author', 'upvotes', 'downvotes', 'replies', 'category'],
      where: postIds,
      order: { created: 'DESC' },
      take: limit,
      skip: limit * (page - 1),
    });

    return {
      pages,
      nodes: allPosts.map(post => this.toResponseObject(post)),
    };
  }

  async showAll(page: number = 1, limit: number = 25, newest?: boolean) {
    const postCount = await this.postRepository.count();
    const pages = Math.ceil(postCount / limit);
    const posts = await this.postRepository.find({
      relations: ['author', 'upvotes', 'downvotes', 'replies', 'category'],
      take: limit,
      skip: limit * (page - 1),
      order: newest && { created: 'DESC' },
    });
    return {
      pages,
      nodes: posts.map(post => this.toResponseObject(post)),
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
      relations: ['children'],
    });
    let where = [{ category: categoryId }];

    // Note check the length here for proper checking since sub category will have empty array
    if (category.children.length) {
      // this is parent category, so get posts from all sub categories
      where = category.children.map(child => {
        return { category: child.id };
      });
    }
    const postCount = await this.postRepository.count({
      where,
    });
    const pages = Math.ceil(postCount / limit);
    const posts = await this.postRepository.find({
      where,
      relations: ['author', 'upvotes', 'downvotes'],
      take: limit,
      skip: limit * (page - 1),
      order: newest && { created: 'DESC' },
    });
    return {
      pages,
      nodes: posts.map(post => this.toResponseObject(post)),
    };
  }

  async showByUser(
    userId: string,
    page: number = 1,
    limit: number = 25,
    newest: boolean = true,
  ) {
    const postCount = await this.postRepository.count({
      where: { author: userId },
    });
    const pages = Math.ceil(postCount / limit);
    const posts = await this.postRepository.find({
      where: { author: userId },
      relations: ['upvotes', 'downvotes'],
      take: limit,
      skip: limit * (page - 1),
      order: newest && { created: 'DESC' },
    });
    return {
      pages,
      nodes: posts.map(post => this.toResponseObject(post)),
    };
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
      relations: ['parent'],
    });
    if (!category) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    if (!category.parent) {
      throw new HttpException(
        'Cannot create a post on primary forum category',
        HttpStatus.BAD_REQUEST,
      );
    }
    const parsedRawComment = JSON.parse(data.commentRaw);
    const post = await this.postRepository.create({
      caption: data.caption,
      comment: data.comment,
      commentRaw: parsedRawComment,
      author: user,
      category,
    });
    await this.postRepository.save(post);
    return this.toResponseObject(post);
  }

  async show(id: string): Promise<PostResponseDTO> {
    const post = await this.postRepository.find({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'replies', 'category'],
    });
    if (!post.length) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(post[0]);
  }

  async showBySlug(slug: string): Promise<PostResponseDTO> {
    const post = await this.postRepository.find({
      where: { slug },
      relations: ['author', 'upvotes', 'downvotes', 'category'],
    });
    if (!post || !post.length) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(post[0]);
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
    const parsedRawComment = JSON.parse(data.commentRaw);
    const updatedPost = {
      caption: data.caption,
      comment: data.comment,
      commentRaw: parsedRawComment,
    };
    await this.postRepository.update({ id }, updatedPost);
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

  async upvote(id: string, userId: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'replies'],
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // check if post is already downvoted
    if (post.downvotes.filter(voter => voter.id === user.id).length > 0) {
      // if already downvoted, then remove downvote
      post.downvotes = post.downvotes.filter(voter => voter.id !== user.id);
    }
    // check if post is already upvoted, and only upvote if not
    if (post.upvotes.filter(voter => voter.id === user.id).length === 0) {
      post.upvotes.push(user);
    } else {
      post.upvotes = post.upvotes.filter(voter => voter.id !== user.id);
    }
    await this.postRepository.save(post);
    return this.toResponseObject(post);
  }

  async downvote(id: string, userId: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'replies'],
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // check if post is already upvoted
    if (post.upvotes.filter(voter => voter.id === user.id).length > 0) {
      // if upvoted remove the upvote
      post.upvotes = post.upvotes.filter(voter => voter.id !== user.id);
    }

    // check if post is already downvoted, and only upvote if not
    if (post.downvotes.filter(voter => voter.id === user.id).length === 0) {
      post.downvotes.push(user);
    } else {
      post.downvotes = post.downvotes.filter(voter => voter.id !== user.id);
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
