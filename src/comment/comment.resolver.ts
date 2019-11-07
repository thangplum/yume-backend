import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CommentDTO } from './comment.dto';

@Resolver('Comment')
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query()
  async comment(@Args('id') id: string) {
    return await this.commentService.show(id);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createComment(
    @Args('reply') replyId: string,
    @Args('comment') comment: string,
    @CurrentUser() user,
  ) {
    const data: CommentDTO = { comment };
    const { id: userId } = user;
    return await this.commentService.create(replyId, userId, data);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deleteComment(@Args('id') id: string, @CurrentUser() user) {
    const { id: userId } = user;
    return await this.commentService.deleteComment(id, userId);
  }
}
