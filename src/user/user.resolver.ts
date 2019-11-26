import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { ReplyService } from '../reply/reply.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly replyService: ReplyService,
  ) {}

  @Query('users')
  async users(@Args('page') page: number) {
    return await this.userService.showAll(page);
  }

  @Query()
  async user(@Args('email') email: string) {
    return await this.userService.read(email);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async whoami(@CurrentUser() user) {
    const { email } = user;
    return await this.userService.read(email);
  }

  @ResolveProperty()
  async replies(@Parent() user) {
    const { id } = user;
    return await this.replyService.showByUser(id);
  }
}
