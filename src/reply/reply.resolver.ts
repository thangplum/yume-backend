import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { ReplyService } from './reply.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { ReplyDTO } from './reply.dto';

@Resolver('Reply')
export class ReplyResolver {
  constructor(private readonly replyService: ReplyService) {}

  @Query()
  async reply(@Args('id') id: string) {
    return await this.replyService.show(id);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async createReply(
    @Args('post') postId: string,
    @Args('comment') comment: string,
    @Context('user') user,
  ) {
    const data: ReplyDTO = { comment };
    const { id: userId } = user;
    return await this.replyService.create(postId, userId, data);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async deleteReply(@Args('id') id: string, @Context('user') user) {
    const { id: userId } = user;
    return await this.replyService.deleteReply(id, userId);
  }
}
