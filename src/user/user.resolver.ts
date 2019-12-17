import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { ReplyService } from '../reply/reply.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { PostService } from '../post/post.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly replyService: ReplyService,
    private readonly postService: PostService,
  ) {}

  @Query('users')
  async users(@Args('page') page: number) {
    return await this.userService.showAll(page);
  }

  @Query()
  async user(@Args('username') username: string) {
    return await this.userService.read(username);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async whoami(@CurrentUser() user) {
    const { username } = user;
    return await this.userService.read(username);
  }

  @ResolveProperty()
  async replies(@Parent() user) {
    const { id } = user;
    return await this.replyService.showByUser(id);
  }

  @ResolveProperty()
  async posts(
    @Parent() user,
    @Args('page') page: number,
    @Args('limit') limit: number,
    @Args('newest') newest: boolean,
  ) {
    const { id } = user;
    const posts = await this.postService.showByUser(id, page, limit, newest);
    return posts;
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('major') major: string,
    @Args('college') college: string,
    @Args('location') location: string,
    @CurrentUser() user,
  ) {
    const { id: userId } = user;
    return await this.userService.updateUser(
      userId,
      firstName,
      lastName,
      major,
      college,
      location,
    );
  }
}
