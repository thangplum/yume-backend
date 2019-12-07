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
import { PostDTO } from './post.dto';
import { GqlAuthGuard } from '../auth/gql.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver('Post')
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly replyService: ReplyService,
  ) {}

  @Query('posts')
  async posts(
    @Args('page') page: number,
    @Args('limit') limit: number,
    @Args('newest') newest: boolean,
  ) {
    return await this.postService.showAll(page, limit, newest);
  }

  // posts implementation using cursor
  async postsCursor(
    @Args('first') first: number,
    @Args('after') after: string,
    @Args('last') last: number,
    @Args('before') before: string,
  ) {
    return await this.postService.showPostConnection(
      first,
      after,
      last,
      before,
    );
  }

  @Query('post')
  async post(@Args('id') id: string) {
    return await this.postService.show(id);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args('caption') caption: string,
    @Args('comment') comment: string,
    @Args('category') categoryId: string,
    @CurrentUser() user,
  ) {
    const data: PostDTO = { caption, comment };
    const { id: userId } = user;
    return await this.postService.create(userId, categoryId, data);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args('id') id: string,
    @Args('caption') caption: string,
    @Args('comment') comment: string,
    @CurrentUser() user,
  ) {
    const data: PostDTO = { caption, comment };
    const { id: userId } = user;
    return await this.postService.update(id, userId, data);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deletePost(@Args('id') id: string, @CurrentUser() user) {
    const { id: userId } = user;
    return await this.postService.delete(id, userId);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async likePost(@Args('id') id: string, @CurrentUser() user) {
    const { id: userId } = user;
    return await this.postService.like(id, userId);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async bookmark(@Args('id') id: string, @CurrentUser() user) {
    const { id: userId } = user;
    return await this.postService.bookmark(id, userId);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async unbookmark(@Args('id') id: string, @CurrentUser() user) {
    const { id: userId } = user;
    return await this.postService.unBookmark(id, userId);
  }

  @ResolveProperty()
  async replies(
    @Parent() post,
    @Args('page') page: number,
    @Args('limit') limit: number,
  ) {
    const { id } = post;
    return await this.replyService.showByPost(id, page, limit);
  }
}
