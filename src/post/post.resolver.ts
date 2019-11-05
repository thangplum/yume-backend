import {
  Resolver,
  Args,
  Query,
  ResolveProperty,
  Parent,
  Mutation,
  Context,
} from '@nestjs/graphql';
import { PostService } from './post.service';
import { ReplyService } from '../reply/reply.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { PostDTO } from './post.dto';

@Resolver('Post')
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly replyService: ReplyService,
  ) {}

  @Query('posts')
  async posts(@Args('page') page: number, @Args('newest') newest: boolean) {
    return await this.postService.showAll(page, newest);
  }

  @Query('post')
  async post(@Args('id') id: string) {
    return await this.postService.show(id);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async createPost(
    @Args('caption') caption: string,
    @Args('comment') comment: string,
    @Context('user') user,
  ) {
    const data: PostDTO = { caption, comment };
    const { id: userId } = user;
    return await this.postService.create(userId, data);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async updatePost(
    @Args('id') id: string,
    @Args('caption') caption: string,
    @Args('comment') comment: string,
    @Context('user') user,
  ) {
    const data: PostDTO = { caption, comment };
    const { id: userId } = user;
    return await this.postService.update(id, userId, data);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async deletePost(@Args('id') id: string, @Context('user') user) {
    const { id: userId } = user;
    return await this.postService.delete(id, userId);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async like(@Args('id') id: string, @Context('user') user) {
    const { id: userId } = user;
    return await this.postService.like(id, userId);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async bookmark(@Args('id') id: string, @Context('user') user) {
    const { id: userId } = user;
    return await this.postService.bookmark(id, userId);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async unbookmark(@Args('id') id: string, @Context('user') user) {
    const { id: userId } = user;
    return await this.postService.unBookmark(id, userId);
  }

  @ResolveProperty()
  async replies(@Parent() post) {
    const { id } = post;
    return await this.replyService.showByPost(id);
  }
}
