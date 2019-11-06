import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  Delete,
  Query,
} from '@nestjs/common';
import { ReplyService } from './reply.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/user.decorator';
import { ReplyDTO } from './reply.dto';

@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Get('post/:id')
  showRepliesByPost(@Param('id') postId: string, @Query('page') page: number) {
    return this.replyService.showByPost(postId, page);
  }

  @Get('user/:id')
  showRepliesByUser(@Param('id') userId: string, @Query('page') page: number) {
    return this.replyService.showByUser(userId, page);
  }

  @Post('post/:id')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  deleteReply(@Param('id') id: string, @User('id') userId: string) {
    return this.replyService.deleteReply(id, userId);
  }
}
