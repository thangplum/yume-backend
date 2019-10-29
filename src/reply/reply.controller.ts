import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  Delete,
} from '@nestjs/common';
import { ReplyService } from './reply.service';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../user/user.decorator';
import { ReplyDTO } from './reply.dto';

@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Get('post/:id')
  showRepliesByPost(@Param('id') postId: string) {
    return this.replyService.showByPost(postId);
  }

  @Get('user/:id')
  showRepliesByUser(@Param('id') userId: string) {
    return this.replyService.showByUser(userId);
  }

  @Post('post/:id')
  @UseGuards(new AuthGuard())
  createReply(
    @Param('id') postId: string,
    @User('id') userId: string,
    @Body() data: ReplyDTO,
  ) {
    return this.replyService.create(postId, userId, data);
  }

  @Get(':id')
  showReply(@Param('id') id: string) {
    return this.replyService.show(id);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  deleteReply(@Param('id') id: string, @User('id') userId: string) {
    return this.replyService.deleteReply(id, userId);
  }
}
