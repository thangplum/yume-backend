import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { ReplyService } from './reply.service';
import { UseGuards } from '@nestjs/common';
import { ReplyDTO } from './reply.dto';
import { GqlAuthGuard } from '../auth/gql.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver('Reply')
export class ReplyResolver {
  constructor(private readonly replyService: ReplyService) {}

  @Query()
  async reply(@Args('id') id: string) {
    return await this.replyService.show(id);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createReply(
    @Args('post') postId: string,
    @Args('comment') comment: string,
    @CurrentUser() user,
  ) {
    const data: ReplyDTO = { comment };
    const { id: userId } = user;
    return await this.replyService.create(postId, userId, data);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deleteReply(@Args('id') id: string, @CurrentUser() user) {
    const { id: userId } = user;
    return await this.replyService.deleteReply(id, userId);
  }
}
