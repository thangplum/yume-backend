import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { FlagService } from './flag.service';
import { GqlAuthGuard } from '../auth/gql.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver('Flag')
export class FlagResolver {
  constructor(private readonly flagService: FlagService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async flags(@CurrentUser() user) {
    const { id: userId } = user;
    return await this.flagService.showAll(userId);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createFlag(
    @Args('post') postId: string,
    @Args('reason') reason: string,
    @CurrentUser() user,
  ) {
    const { id: userId } = user;
    return await this.flagService.create(postId, reason, userId);
  }
}
